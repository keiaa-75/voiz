/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://www.mozilla.org/MPL/2.0/.
 */

document.addEventListener('DOMContentLoaded', () => {
    const validationAlert = document.getElementById('validation-alert');
    const form = document.getElementById('reportForm');
    const spinnerOverlay = document.getElementById('spinner-overlay');

    form.addEventListener('submit', (event) => {
        const confirmationCheckbox = document.getElementById('confirmation');
        if (!confirmationCheckbox.checked) {
            event.preventDefault();
            const validationAlert = document.getElementById('validation-alert');
            validationAlert.textContent = 'Please confirm that the report is true and accurate.';
            validationAlert.classList.remove('d-none');
            confirmationCheckbox.classList.add('is-invalid');
            return;
        }
        spinnerOverlay.classList.add('show');
    });

    createMultiStepForm('reportForm', {
        validateStep: (stepNumber) => {
            validationAlert.classList.add('d-none');
            if (stepNumber === 3) {
                return true;
            }
            const currentStepFields = document.getElementById('reportForm').querySelectorAll('.form-step')[stepNumber - 1].querySelectorAll('[required]');
            let isValid = true;
            currentStepFields.forEach(field => {
                let isFieldValid = true;
                if ((field.type === 'checkbox' && !field.checked) || (field.type !== 'checkbox' && !field.value.trim())) {
                    isFieldValid = false;
                } else if (field.id === 'name') {
                    const nameRegex = /^[\p{L}' -]+$/u;
                    if (!nameRegex.test(field.value)) {
                        isFieldValid = false;
                    }
                } else if (field.type === 'email') {
                    isFieldValid = field.checkValidity();
                }

                if (!isFieldValid) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            if (!isValid) {
                validationAlert.textContent = 'Please correct the errors before proceeding.';
                validationAlert.classList.remove('d-none');
            }

            return isValid;
        },
        onStepChange: (currentStep) => {
            const steps = document.getElementById('reportForm').querySelectorAll('.form-step');
            if (currentStep === steps.length) {
                document.getElementById('review-name').textContent = document.getElementById('name').value;
                document.getElementById('review-email').textContent = document.getElementById('email').value;
                const categorySelect = document.getElementById('category');
                document.getElementById('review-category').textContent = categorySelect.options[categorySelect.selectedIndex].text;
                document.getElementById('review-description').textContent = document.getElementById('description').value;
                
                const reviewFiles = document.getElementById('review-files');
                reviewFiles.innerHTML = ''; // Clear previous entries
                const files = document.getElementById('files').files;
                if (files.length > 0) {
                    for (const file of files) {
                        const li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.textContent = file.name;
                        reviewFiles.appendChild(li);
                    }
                } else {
                    const li = document.createElement('li');
                    li.className = 'list-group-item text-muted';
                    li.textContent = 'No files uploaded.';
                        reviewFiles.appendChild(li);
                }

                const externalLink = document.getElementById('externalLink').value;
                document.getElementById('review-externalLink').textContent = externalLink || 'N/A';
            }
        }
    });

    const filesInput = document.querySelector('#files');
    const fileError = document.querySelector('#file-error');
    const nextBtn = document.querySelector('#nextBtn');

    if (filesInput) {
        const validateFiles = () => {
            const maxFileSize = 10 * 1024 * 1024;
            fileError.textContent = '';
            nextBtn.disabled = false;

            if (filesInput.files.length > 0) {
                for (const file of filesInput.files) {
                    if (file.size > maxFileSize) {
                        fileError.textContent = `File "${file.name}" is too large. Maximum size is 10 MB.`;
                        nextBtn.disabled = true;
                        return;
                    }
                }
            }
        };

        filesInput.addEventListener('change', validateFiles);
    }

    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        const referenceIdInput = document.getElementById('referenceId');
        const copyFeedback = document.getElementById('copy-feedback');

        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(referenceIdInput.value).then(() => {
                copyFeedback.classList.remove('d-none');
                copyBtn.innerHTML = '<i class="bi bi-check-lg text-success"></i>';
                setTimeout(() => {
                    copyFeedback.classList.add('d-none');
                    copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }
});