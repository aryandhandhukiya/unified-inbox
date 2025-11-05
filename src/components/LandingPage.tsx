"use client";

import Link from "next/link";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Send, 
  Hash, 
  MessageCircle,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Check
} from "lucide-react";

export default function LandingPage({ 
  session 
}: { 
  session: any 
}) {
  const features = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Connect your WhatsApp Business",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Mail,
      title: "Email",
      description: "Sync Gmail and other providers",
      color: "from-red-500 to-orange-600"
    },
    {
      icon: Phone,
      title: "SMS",
      description: "Send and receive text messages",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Send,
      title: "Telegram",
      description: "Integrate your Telegram bot",
      color: "from-sky-500 to-blue-600"
    },
    {
      icon: Hash,
      title: "Discord",
      description: "Manage Discord conversations",
      color: "from-indigo-500 to-purple-600"
    }
  ];

  const benefits = [
    "Unified conversations across all platforms",
    "Real-time message synchronization",
    "Smart contact management",
    "Secure and encrypted",
    "Beautiful, intuitive interface"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Unified Inbox</span>
          </div>
          
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <span className="text-white/80 text-sm hidden sm:block">
                  Welcome, {session.user?.name || 'User'}
                </span>
                <Link
                  href="/inbox"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/50"
                >
                  Go to Inbox
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-purple-500/50"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm mb-8">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>All your messages in one powerful platform</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Unify Your
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Communication
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Connect WhatsApp, Email, SMS, Telegram, and Discord. Manage all your conversations from a single, beautiful interface.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {session ? (
                <Link
                  href="/inbox"
                  className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-2xl shadow-purple-500/50 flex items-center gap-2"
                >
                  Open Inbox
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-2xl shadow-purple-500/50 flex items-center gap-2"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/login"
                    className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Benefits List */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white mb-8">
                Why Choose Unified Inbox?
              </h2>
              
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-200 text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Right: Stats/Info Cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-500/30">
                <div className="text-4xl font-bold text-white mb-2">5+</div>
                <div className="text-gray-300">Platforms Connected</div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-purple-500/30">
                <div className="text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-gray-300">Real-time Sync</div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-xl border border-pink-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-6 h-6 text-white" />
                  <div className="text-2xl font-bold text-white">Secure</div>
                </div>
                <div className="text-gray-300">End-to-end encrypted</div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-6 h-6 text-white" />
                  <div className="text-2xl font-bold text-white">Global</div>
                </div>
                <div className="text-gray-300">Access anywhere</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 mt-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>© 2024 Unified Inbox. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}