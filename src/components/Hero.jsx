import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold gradient-text mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Reforge AI Sessions
          </motion.h1>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero