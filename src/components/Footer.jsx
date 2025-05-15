import { motion } from 'framer-motion'
import { FiCode, FiGithub } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-light-100 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center md:text-left"
          >
            <p className="text-dark-600 text-sm flex items-center justify-center md:justify-start gap-2">
              <FiCode size={18} />
              This site was built using AI just like you would expect.
            </p>
          </motion.div>
          
          <div className="flex items-center gap-6">
            <a 
              href="https://reforge.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-dark-600 hover:text-primary-600 transition-colors"
            >
              Reforge
            </a>
            <a 
              href="#" 
              className="text-dark-600 hover:text-primary-600 transition-colors flex items-center gap-1"
            >
              <FiGithub />
              <span>Repository</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer