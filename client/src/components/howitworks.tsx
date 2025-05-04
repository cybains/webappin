"use client";

import { ClipboardList, UserCheck, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <ClipboardList className="h-8 w-8 text-primary" />,
    title: "Step 1: Intake Form",
    description: "Tell us your needs in a quick form—it only takes a minute.",
  },
  {
    icon: <UserCheck className="h-8 w-8 text-primary" />,
    title: "Step 2: Get Matched",
    description: "We connect you with a consultant who understands your goals.",
  },
  {
    icon: <MessageCircle className="h-8 w-8 text-primary" />,
    title: "Step 3: Receive Guidance",
    description: "Get tailored advice, visa help, or job matching solutions.",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="py-20 px-4"
      style={{ backgroundColor: "var(--background)" }}
      id="how-it-works"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-4"
          style={{ color: "var(--foreground)" }}
        >
          How It Works
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-600 dark:text-gray-300 mb-12"
          style={{ color: "var(--foreground)" }}
        >
          A simple process designed to give you the clarity and guidance you need.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="flex flex-col items-center text-center p-6"
              style={{
                backgroundColor: "var(--backgroundCard)",
                color: "var(--foreground)",
                borderRadius: "1.25rem",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="mb-4">{step.icon}</div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                {step.title}
              </h3>
              <p
                className="text-gray-600 dark:text-gray-300 text-sm"
                style={{ color: "var(--foreground)" }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Animated timeline */}
        <div className="hidden md:flex justify-between items-center mt-16 px-8 relative h-8">
          {/* Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="absolute top-1/2 left-0 right-0 h-1"
            style={{
              backgroundColor: "var(--primary)", // Ensures it aligns with primary color
            }}
          />

          {/* Dots */}
          {steps.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.2, duration: 0.4 }}
              className="w-4 h-4 rounded-full z-10 border-4 border-white dark:border-gray-800"
              style={{
                backgroundColor: "var(--primary)", // Dot color
                borderColor: "var(--background)", // Border color based on background
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
