/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://www.mozilla.org/MPL/2.0/.
 */

package com.keiaa.voiz.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.keiaa.voiz.model.Appointment;
import com.keiaa.voiz.repository.AppointmentRepository;
import com.keiaa.voiz.service.EmailService;

@Controller
@RequestMapping("/schedule")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public String showForm(Model model) {
        if (!model.containsAttribute("appointment")) {
            model.addAttribute("appointment", new Appointment());
        }
        return "schedule";
    }

    @PostMapping
    public String submitAppointment(@Valid @ModelAttribute("appointment") Appointment appointment, 
                                   BindingResult bindingResult, 
                                   RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            redirectAttributes.addFlashAttribute("error", "Please correct the errors in the form");
            return "redirect:/schedule";
        }
        
        appointmentRepository.save(appointment);
        emailService.sendAppointmentConfirmation(appointment);
        redirectAttributes.addFlashAttribute("message", "Your counseling session request has been submitted successfully!");
        return "redirect:/schedule";
    }
}
