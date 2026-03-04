'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ShoppingCart, Search, Menu, X, Loader2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { usePathname, useRouter } from 'next/navigation'
import { searchProducts } from '@/app/actions/search'
import Image from 'next/image'

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

export function Navbar() {
    const { cartCount, toggleCart } = useCart()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    // Search State
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const mobileSearchRef = useRef<HTMLDivElement>(null)

    const debouncedQuery = useDebounce(searchQuery, 300)

    // Handle Search Effect
    useEffect(() => {
        const performSearch = async () => {
            if (debouncedQuery.length < 2) {
                setSearchResults([])
                return
            }

            setIsSearching(true)
            const { products } = await searchProducts(debouncedQuery)
            setSearchResults(products || [])
            setIsSearching(false)
            setShowResults(true)
        }

        performSearch()
    }, [debouncedQuery])

    // Close search on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                (searchRef.current && !searchRef.current.contains(event.target as Node)) &&
                (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node))
            ) {
                setShowResults(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleProductClick = (productId: string) => {
        setShowResults(false)
        setSearchQuery('')
        router.push(`/product/${productId}`)
    }

    return (
        <header className="sticky top-0 z-100 w-full border-b border-white/10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
            <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <div className="relative group-hover:scale-105 transition-transform duration-300">
                        <div className="absolute inset-0 bg-primary blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-lg"></div>
                        <Image
                            src="/rigid-logo-full.png"
                            alt="Rigid Traders Logo"
                            width={160}
                            height={40}
                            className="relative drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                        />
                    </div>
                </Link>
                <nav className="hidden md:flex items-center gap-10 shrink-0">
                    {['Home', 'Store', 'Contact'].map((item) => {
                        const href = item === 'Home' ? '/' : `/${item.toLowerCase()}`
                        const isActive = pathname === href
                        return (
                            <Link key={item} href={href} className={`relative text-sm font-bold uppercase tracking-widest transition-colors py-2 group ${isActive ? 'text-white' : 'text-zinc-400 hover:text-white'}`}>
                                {item}
                                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-out shadow-[0_0_10px_var(--primary)] ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Search Bar (Desktop/Expanded) */}
                <div className="hidden md:block flex-1 max-w-md mx-4 relative" ref={searchRef}>
                    <div className="relative group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                if (e.target.value.length >= 2) setShowResults(true)
                            }}
                            placeholder="SEARCH PARTS..."
                            className="w-full bg-zinc-900/50 border border-zinc-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 pl-10 pr-4 rounded-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-600"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={16} />
                        {isSearching && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-primary animate-spin" size={16} />
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    {showResults && searchQuery.length >= 2 && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-sm shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                            {searchResults.length > 0 ? (
                                <div className="divide-y divide-zinc-800">
                                    {searchResults.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => handleProductClick(product.id)}
                                            className="flex items-center gap-4 p-3 hover:bg-zinc-800/50 cursor-pointer transition-colors group"
                                        >
                                            <div className="relative w-12 h-12 bg-zinc-950 rounded-sm overflow-hidden border border-zinc-800 shrink-0">
                                                {product.images?.[0] ? (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <Image
                                                        src="/no-image-placeholder.png"
                                                        alt="No image"
                                                        fill
                                                        className="object-cover opacity-60"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white text-xs font-bold uppercase tracking-wide truncate group-hover:text-primary transition-colors">{product.title}</h4>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-[10px] text-zinc-500 font-mono">{product.sku}</span>
                                                    <span className="text-primary text-xs font-bold">Rs {product.price.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                !isSearching && (
                                    <div className="p-4 text-center text-zinc-500 text-xs font-mono uppercase tracking-widest">
                                        No results found
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6 shrink-0">
                    <button onClick={toggleCart} className="relative group cursor-pointer">
                        <ShoppingCart size={22} className="text-zinc-400 group-hover:text-primary transition-colors" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-sm skew-x-[-10deg] shadow-lg animate-in zoom-in">
                                <span className="skew-x-10">{cartCount}</span>
                            </span>
                        )}
                    </button>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-primary hover:text-white transition-colors">
                        <Menu size={24} />
                    </button>

                    {/* Desktop User Link */}
                    <Link href="/login" className="hidden md:block w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 hover:border-primary transition-colors"></Link>
                </div>
            </div>

            {/* Mobile Search Bar (Below Navbar) */}
            <div className="md:hidden px-6 pb-4 animate-in slide-in-from-top-4 fade-in duration-500" ref={mobileSearchRef}>
                <div className="relative group">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            if (e.target.value.length >= 2) setShowResults(true)
                        }}
                        placeholder="SEARCH PARTS..."
                        className="w-full bg-zinc-900/50 border border-zinc-700 text-white text-xs font-bold uppercase tracking-wider py-3 pl-10 pr-4 rounded-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-600 shadow-inner"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={16} />
                    {isSearching && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-primary animate-spin" size={16} />
                    )}

                    {/* Mobile Search Results */}
                    {showResults && searchQuery.length >= 2 && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-sm shadow-xl overflow-hidden z-50">
                            {searchResults.length > 0 ? (
                                <div className="divide-y divide-zinc-800 max-h-[60vh] overflow-y-auto">
                                    {searchResults.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => handleProductClick(product.id)}
                                            className="flex items-center gap-4 p-3 hover:bg-zinc-800/50 cursor-pointer transition-colors group"
                                        >
                                            <div className="relative w-10 h-10 bg-zinc-950 rounded-sm overflow-hidden border border-zinc-800 shrink-0">
                                                {product.images?.[0] ? (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <Image
                                                        src="/no-image-placeholder.png"
                                                        alt="No image"
                                                        fill
                                                        className="object-cover opacity-60"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white text-xs font-bold uppercase tracking-wide truncate group-hover:text-primary transition-colors">{product.title}</h4>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-[10px] text-primary font-bold">Rs {product.price.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                !isSearching && (
                                    <div className="p-4 text-center text-zinc-500 text-xs font-mono uppercase tracking-widest">
                                        No results found
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {
                isMenuOpen && (
                    <div
                        className="fixed inset-0 z-100 h-dvh flex flex-col p-0 md:hidden animate-in slide-in-from-bottom-10 fade-in duration-300 bg-black/80"
                    >
                        <div style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }} className='w-full h-full flex flex-col'>
                            <div className="flex justify-end p-6">
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition-all active:scale-95 border border-white/5 backdrop-blur-md shadow-lg"
                                >
                                    <X size={24} />
                                </button>
                            </div>



                            <nav className="flex flex-col gap-6 text-center justify-start flex-1 px-6">
                                {['Home', 'Store', 'Contact'].map((item) => {
                                    const href = item === 'Home' ? '/' : `/${item.toLowerCase()}`
                                    const isActive = pathname === href

                                    return (
                                        <Link
                                            key={item}
                                            href={href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`
                                            text-2xl font-black uppercase tracking-widest transition-all font-heading transform hover:scale-105
                                            ${isActive ? 'text-primary drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'text-zinc-400 hover:text-white'}
                                        `}
                                        >
                                            {item}
                                            {isActive && <div className="h-1 w-12 bg-primary mx-auto mt-3 rounded-full shadow-[0_0_10px_var(--primary)]"></div>}
                                        </Link>
                                    )
                                })}

                                <div className="pt-8 flex justify-center">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors border border-zinc-800 px-6 py-3 rounded-sm"
                                    >
                                        Member Login
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    </div>
                )
            }
        </header >
    )
}