import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-gray-800">Contact Information</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-lg text-gray-700">
          <Mail className="h-6 w-6 text-teal-500" />
          <span>contact@example.com</span>
        </div>
        <div className="flex items-center space-x-3 text-lg text-gray-700">
          <Phone className="h-6 w-6 text-teal-500" />
          <span>+1 (555) 123-4567</span>
        </div>
        <div className="flex items-center space-x-3 text-lg text-gray-700">
          <MapPin className="h-6 w-6 text-teal-500" />
          <span>123 Business St, City, State 12345</span>
        </div>
        <div className="flex items-center space-x-3 text-lg text-gray-700">
          <Clock className="h-6 w-6 text-teal-500" />
          <span>Mon-Fri: 9AM-5PM</span>
        </div>
      </div>
    </motion.div>
  );
}
