"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function SubmissionSuccess({ onGoBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-8 bg-green-100 rounded-lg"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
        className="text-2xl font-bold text-green-700 mb-2"
      >
        Thank You!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
        className="text-center text-green-600 mb-4"
      >
        Your message has been successfully submitted. We'll get back to you soon!
      </motion.p>

      {/* Go Back Button */}
<button
  onClick={onGoBack}
  className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
>
  Go Back
</button>

    </motion.div>
  );
}
