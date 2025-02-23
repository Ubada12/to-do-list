"use client"
import { motion } from "framer-motion"
import { useSpring, animated } from "react-spring"
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa"

const Footer = () => {
  const socialIcons = [
    { icon: <FaFacebookF />, href: "https://facebook.com" },
    { icon: <FaTwitter />, href: "https://twitter.com" },
    { icon: <FaInstagram />, href: "https://instagram.com" },
    { icon: <FaLinkedinIn />, href: "https://linkedin.com" },
  ]

  const footerAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.footer
      className="bg-gradient-to-r from-gray-700 to-slate-800 py-10 text-white shadow-xl"
      initial="hidden"
      animate="visible"
      variants={footerAnimation}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div variants={itemAnimation} className="text-center">
            <h3 className="text-2xl font-bold mb-4">About Us</h3>
            <p className="text-gray-300">
              We are passionate developers creating amazing digital experiences. Our mission is to make the web a better
              place for everyone.
            </p>
          </motion.div>
          <motion.div variants={itemAnimation} className="text-center">
            <h3 className="text-2xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Services", "Projects", "Careers", "Contact"].map((item, index) => (
                <li key={index}>
                  <AnimatedLink href="#">{item}</AnimatedLink>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div variants={itemAnimation} className="text-center">
            <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
            <div className="flex justify-center space-x-4">
              {socialIcons.map((social, index) => (
                <AnimatedSocialIcon key={index} href={social.href}>
                  {social.icon}
                </AnimatedSocialIcon>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div className="mt-8 pt-8 border-t border-slate-600 text-center" variants={itemAnimation}>
          <p className="text-sm text-gray-300">© {new Date().getFullYear()} Your App Name. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  )
}

const AnimatedLink = ({ children, href }) => {
  const [props, set] = useSpring(() => ({
    transform: "translateX(0px)",
    color: "rgb(209, 213, 219)",
  }))

  return (
    <animated.a
      href={href}
      style={props}
      onMouseEnter={() => set({ transform: "translateX(5px)", color: "rgb(255, 255, 255)" })}
      onMouseLeave={() => set({ transform: "translateX(0px)", color: "rgb(209, 213, 219)" })}
      className="block transition-colors duration-200"
    >
      {children}
    </animated.a>
  )
}

const AnimatedSocialIcon = ({ children, href }) => {
  const [props, set] = useSpring(() => ({
    transform: "scale(1)",
    color: "rgb(255, 255, 255)",
  }))

  return (
    <animated.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={props}
      onMouseEnter={() => set({ transform: "scale(1.2)", color: "rgb(129, 140, 248)" })}
      onMouseLeave={() => set({ transform: "scale(1)", color: "rgb(255, 255, 255)" })}
      className="text-2xl transition-colors duration-200"
    >
      {children}
    </animated.a>
  )
}

export default Footer
