'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShoppingBag,
  ArrowRight,
  HelpCircle,
  Smartphone,
  RotateCcw,
  Search
} from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  products?: any[]
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Merhaba! Ben Mobil Parça Merkezi Yapay Zeka Asistanıyım. Aşağıdan kategori/marka seçerek hızlıca arayabilir, ya da telefon modelinizi/aradığınız parçayı yazabilirsiniz.',
}

export default function SmartAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Seçimli (butonlu) arama — AI'ya gitmeden, token maliyetsiz hızlı sonuç
  const [options, setOptions] = useState<{ categories: any[]; brands: string[] }>({ categories: [], brands: [] })
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [modelText, setModelText] = useState('')
  const [guidedLoading, setGuidedLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  useEffect(() => {
    if (isOpen && options.categories.length === 0) {
      fetch('/api/assistant/options')
        .then((r) => r.json())
        .then((d) => setOptions({ categories: d.categories || [], brands: d.brands || [] }))
        .catch(() => {})
    }
  }, [isOpen])

  const handleReset = () => {
    setMessages([WELCOME_MESSAGE])
    setSelectedCategory(null)
    setSelectedBrand(null)
    setModelText('')
    setInput('')
  }

  const handleGuidedSearch = async () => {
    if (guidedLoading) return
    setGuidedLoading(true)

    const label = [selectedCategory, selectedBrand, modelText.trim()].filter(Boolean).join(' / ') || 'Tüm ürünler'
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: `🔎 ${label}` }])

    try {
      const catSlug = options.categories.find((c) => c.name === selectedCategory)?.slug
      const res = await fetch('/api/assistant/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categorySlug: catSlug, brand: selectedBrand, model: modelText.trim() }),
      })
      const data = await res.json()
      const products = data.products || []

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: products.length > 0 ? `${products.length} ürün buldum:` : 'Bu kritere uygun ürün bulamadım — farklı bir seçim deneyin veya yazarak sorun.',
        products,
      }])
    } catch {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Arama sırasında bir hata oluştu, lütfen tekrar deneyin.',
      }])
    } finally {
      setGuidedLoading(false)
    }
  }

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const query = input.trim()
    if (!query || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      })

      const data = await response.json()
      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.reply || 'Aradığınız modelle ilgili sonuçları listeledim.',
            products: data.products || [],
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Üzgünüm, şu an bağlantı kurulamadı. Lütfen tekrar deneyin veya arama çubuğunu kullanın.',
          },
        ])
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Bir hata oluştu. Lütfen biraz sonra tekrar deneyiniz.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const quickQuestions = [
    'iPhone 11 bataryası var mı?',
    'Samsung A50 kasa modelleri',
    'Kargo ne zaman ulaşır?',
    'Ürünleriniz garantili mi?',
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white rounded-full shadow-2xl shadow-blue-600/50 hover:scale-105 transition-all duration-300 border border-white/20"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-pulse text-cyan-200" />
          </div>
          <span className="text-xs font-black tracking-wide">AKILLI ASİSTAN</span>
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <span>MPM Akıllı Asistan</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h3>
                <p className="text-[11px] text-slate-400">Yapay Zeka Destekli Model Bulucu</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Başa Dön"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-md'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-sm'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  {/* Product Recommendations if any */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Önerilen Ürünler
                      </span>
                      {msg.products.slice(0, 3).map((prod: any) => (
                        <Link
                          key={prod.id}
                          href={`/urun/${prod.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-bold text-slate-800 truncate text-[11px]">
                              {prod.title}
                            </p>
                            <span className="text-[10px] text-blue-600 font-extrabold">
                              {prod.sale_price} ₺
                            </span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-xs text-slate-400 bg-white p-3 rounded-2xl border border-slate-100 w-fit">
                <Bot className="w-4 h-4 text-blue-600 animate-spin" />
                <span>Parça veritabanı taranıyor...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Seçimli Hızlı Arama Paneli — AI'ya gitmeden kategori/marka/model seçimi */}
          <div className="border-t border-slate-100 bg-white px-3 pt-2.5 pb-1 space-y-1.5">
            {options.categories.length > 0 && (
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {options.categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setSelectedCategory(selectedCategory === c.name ? null : c.name)}
                    className={`shrink-0 px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      selectedCategory === c.name
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
            {options.brands.length > 0 && (
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {options.brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(selectedBrand === b ? null : b)}
                    className={`shrink-0 px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      selectedBrand === b
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-1.5">
              <input
                value={modelText}
                onChange={(e) => setModelText(e.target.value)}
                placeholder="Model (opsiyonel, örn: iPhone 13)"
                className="flex-1 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={handleGuidedSearch}
                disabled={guidedLoading || (!selectedCategory && !selectedBrand && !modelText.trim())}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg text-[11px] font-bold transition-colors"
              >
                {guidedLoading ? <Bot className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                Sonuçları Gör
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px]">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(q)
                  }}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Model veya soru yazın..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
