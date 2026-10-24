import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface MotionFadeProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function MotionFade({ children, className, delay = 0 }: MotionFadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
