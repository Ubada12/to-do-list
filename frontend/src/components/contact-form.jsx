"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import SubmissionSuccess from "./submission-success";

async function sendEmailRequest(user_name, user_email, user_phoneNo, user_msg, isUserEmail) {
  
  const currentTime = new Date();

// Extract the individual components
const day = String(currentTime.getDate()).padStart(2, '0');
const month = String(currentTime.getMonth() + 1).padStart(2, '0'); // Months are 0-based
const year = currentTime.getFullYear();
const hours = String(currentTime.getHours()).padStart(2, '0');
const minutes = String(currentTime.getMinutes()).padStart(2, '0');
const seconds = String(currentTime.getSeconds()).padStart(2, '0');

// Format the date and time
const date_time = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

console.log(date_time);
  
  const subject = "To Do List Query";
  let jsonPayload;
  
  if (isUserEmail) {
      jsonPayload = {
          to: [{ name: user_name, email: user_email }],
          variables: { user_name, user_msg },
          from: { name: "Rizvi Co-operation", email: "no-reply@ubadaa.site" },
          domain: "ubadaa.site",
          template_id: "template_18_09_2024_11_09_2"
      };
  } else {
      jsonPayload = {
          to: [{ name: "Ubada Ghavte", email: "ubadaghawte2005@gmail.com" }],
          variables: { subject, user_name, user_email, user_phoneNo, date_time, user_msg },
          from: { name: "Rizvi Co-operation", email: "no-reply@ubadaa.site" },
          domain: "ubadaa.site",
          template_id: "template_18_09_2024_11_09_3"
      };
  }

  try {
    const response = await fetch("http://localhost:5000/api/tasks/send-email", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonPayload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Email Sent:', data);

     // Check for the success status in the response data
     if (data.status === "success" && !data.hasError) {
      return true; // Email successfully sent
    } else {
      console.error('Error in email sending:', data.errors);
      return false; // Error in sending email
    }
  } catch (error) {
    console.error('Error While Sending Email:', error);
    return false; // Error in sending email 
  }
}


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  useEffect(() => {
    const submissionTime = sessionStorage.getItem("submissionTime");
    if (submissionTime) {
      const timePassed = Date.now() - parseInt(submissionTime);
      const timeLeft = 24 * 60 * 60 * 1000 - timePassed; // 24 hours
      if (timeLeft > 0) {
        setRemainingTime(timeLeft);
        const interval = setInterval(() => {
          setRemainingTime((prev) => {
            const newTime = prev - 1000;
            if (newTime <= 0) clearInterval(interval); // Clear interval when time is up
            return newTime;
          });
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, []);
  

  const onSubmit = async (values) => {
    console.log(values);
    if (await sendEmailRequest(values.name, values.email, values.phone, values.message, true) &&
      await sendEmailRequest(values.name, values.email, values.phone, values.message, false)) {
      setIsSubmitted(true);
      const currentTime = Date.now();
      sessionStorage.setItem("submissionTime", currentTime.toString()); // Store timestamp in sessionStorage
    } else {
      alert("Error in sending email. Please try again later.");
    }
  };

  const handleGoBack = () => {
    form.setValue("name", "");
    form.setValue("email", "");
    form.setValue("phone", "");
    form.setValue("message", "");
    setIsSubmitted(false); // Reset to show the contact form again
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600000); // Get hours
    const minutes = Math.floor((time % 3600000) / 60000); // Get minutes
    const seconds = Math.floor((time % 60000) / 1000); // Get seconds
  
    // Format it to hh:mm:ss
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  

  if (isSubmitted) {
    return <SubmissionSuccess onGoBack={handleGoBack} />;
  }

  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 bg-[#e0e0e0] shadow-xl rounded-lg p-8 transform transition-all hover:scale-105 hover:shadow-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-700">Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} className="p-3 rounded-lg border-2 border-gray-400 focus:border-teal-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-700">Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Your email" {...field} className="p-3 rounded-lg border-2 border-gray-400 focus:border-teal-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-700">Phone (optional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Your phone number" {...field} className="p-3 rounded-lg border-2 border-gray-400 focus:border-teal-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-gray-700">Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Your message" {...field} className="p-3 rounded-lg border-2 border-gray-400 focus:border-teal-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
  type="submit" 
  className="w-full bg-teal-500 text-white hover:bg-teal-600 p-3 rounded-lg"
  disabled={remainingTime > 0} // Disable the button if timer is active
>
  {remainingTime > 0 ? `Please wait ${formatTime(remainingTime)}` : "Submit"}
</Button>

      </motion.form>
    </Form>
  );
}
