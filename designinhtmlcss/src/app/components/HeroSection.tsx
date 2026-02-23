import { ArrowRight, ChevronDown, CreditCard, Sparkles, TrendingUp, Wallet, Shield, Percent, Gift, Zap, Star, Award } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, animate } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

// Counter animation hook
function useCounter(target: number, duration: number = 2) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(0, target, {
      duration,
      delay: 1,
      onUpdate(value) {
        setCount(Math.floor(value));
      }
    });

    return () => controls.stop();
  }, [target, duration]);

  return { count, nodeRef };
}

export function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth parallax effect
  const x = useSpring(useTransform(mouseX, [-window.innerWidth / 2, window.innerWidth / 2], [-20, 20]), { stiffness: 50, damping: 20 });
  const y = useSpring(useTransform(mouseY, [-window.innerHeight / 2, window.innerHeight / 2], [-20, 20]), { stiffness: 50, damping: 20 });

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left - rect.width / 2);
    mouseY.set(event.clientY - rect.top - rect.height / 2);
  }

  return (
    <section 
      id="home" 
      className="bg-gray-50 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
      
      {/* Animated gradient orbs - subtle purple tones */}
      <motion.div 
        className="absolute top-20 left-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        style={{ x, y }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-40 right-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        style={{ x: useTransform(x, (val) => -val), y: useTransform(y, (val) => -val) }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating decorative icons */}
      <motion.div
        className="absolute top-32 right-1/4 opacity-5 pointer-events-none"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <CreditCard className="w-16 h-16 text-purple-600" />
      </motion.div>
      <motion.div
        className="absolute bottom-48 md:bottom-32 left-1/4 opacity-5 pointer-events-none"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Sparkles className="w-12 h-12 text-blue-600" />
      </motion.div>
      <motion.div
        className="absolute top-1/2 md:top-1/2 right-12 md:right-20 opacity-5 pointer-events-none"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <TrendingUp className="w-14 h-14 text-purple-600" />
      </motion.div>
      
      {/* Additional floating icons */}
      <motion.div
        className="absolute top-1/4 left-8 md:left-16 opacity-5 pointer-events-none"
        animate={{
          y: [0, 25, 0],
          rotate: [0, -15, 0],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3
        }}
      >
        <Wallet className="w-14 h-14 text-purple-600" />
      </motion.div>
      
      {/* Hidden on mobile, visible on md and up */}
      <motion.div
        className="hidden md:block absolute top-20 left-1/3 opacity-[0.03] pointer-events-none"
        animate={{
          y: [0, -18, 0],
          rotate: [0, 12, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      >
        <Shield className="w-14 h-14 text-blue-600" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-48 md:bottom-40 right-20 md:right-32 opacity-5 pointer-events-none"
        animate={{
          y: [0, 22, 0],
          rotate: [0, -12, 0],
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8
        }}
      >
        <Percent className="w-15 h-15 text-purple-600" />
      </motion.div>
      
      <motion.div
        className="hidden md:block absolute top-1/3 right-1/3 opacity-5 pointer-events-none"
        animate={{
          y: [0, -25, 0],
          rotate: [0, 18, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 6.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <Gift className="w-12 h-12 text-blue-600" />
      </motion.div>
      
      <motion.div
        className="hidden md:block absolute bottom-1/4 left-20 opacity-5 pointer-events-none"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2
        }}
      >
        <Zap className="w-13 h-13 text-purple-600" />
      </motion.div>
      
      <motion.div
        className="hidden md:block absolute top-40 right-1/4 opacity-5 pointer-events-none"
        animate={{
          y: [0, -22, 0],
          rotate: [0, 20, 0],
        }}
        transition={{
          duration: 5.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6
        }}
      >
        <Star className="w-11 h-11 text-blue-600" />
      </motion.div>
      
      <motion.div
        className="hidden lg:block absolute bottom-1/3 right-1/4 opacity-5 pointer-events-none"
        animate={{
          y: [0, 18, 0],
          rotate: [0, -14, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 7.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.8
        }}
      >
        <Award className="w-14 h-14 text-purple-600" />
      </motion.div>
      
      <motion.div
        className="hidden md:block absolute top-1/2 left-1/4 opacity-5 pointer-events-none"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 16, 0],
        }}
        transition={{
          duration: 6.3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5
        }}
      >
        <CreditCard className="w-12 h-12 text-blue-600" />
      </motion.div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge with shimmer effect */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-8 border border-gray-200 relative overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/30 to-transparent"
              animate={{
                x: ['-200%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 3
              }}
            />
            <span className="w-2 h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse relative z-10" />
            <span className="text-sm font-medium text-black relative z-10">India's #1 Credit Card Comparison Platform</span>
          </motion.div>

          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-black mb-8 leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Best Credit Cards in{' '}
            <span className="relative inline-block">
              India 2026
              <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                <motion.path 
                  d="M2 10C50 4 150 4 198 10" 
                  stroke="url(#gradient)" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-base text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Compare and apply for credit cards online. Find the perfect card with maximum rewards, cashback, and benefits tailored to your lifestyle.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.button 
              className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-all flex items-center gap-2 relative overflow-hidden"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Compare Credit Cards</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </motion.button>
            <motion.button 
              className="bg-white hover:bg-gray-50 text-black font-semibold px-8 py-4 rounded-lg border-2 border-gray-200 hover:border-purple-600 transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Check Eligibility
            </motion.button>
          </motion.div>

          {/* Enhanced Stats with animated counters */}
          <motion.div 
            className="grid grid-cols-3 gap-8 md:gap-12 max-w-3xl mx-auto pt-16 border-t border-gray-100"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <StatCard target={100} suffix="+" label="Credit Cards" delay={0} />
            <StatCard target={20} suffix="+" label="Partner Banks" delay={0.2} />
            <StatCard target={2} suffix="M+" label="Happy Users" delay={0.4} />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Animated stat card component
function StatCard({ target, suffix, label, delay }: { target: number; suffix: string; label: string; delay: number }) {
  const { count, nodeRef } = useCounter(target, 2);

  return (
    <motion.div 
      ref={nodeRef}
      className="group cursor-default"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 + delay, type: "spring" }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div 
        className="text-3xl md:text-4xl font-bold text-black mb-3"
        key={count}
      >
        {count}{suffix}
      </motion.div>
      <div className="text-xs md:text-sm text-gray-500 font-medium uppercase tracking-wide">{label}</div>
    </motion.div>
  );
}