import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const COUNTRY_CODES = [
  { code: '+591', label: 'BO +591', flag: '🇧🇴' },
  { code: '+54', label: 'AR +54', flag: '🇦🇷' },
  { code: '+56', label: 'CL +56', flag: '🇨🇱' },
  { code: '+57', label: 'CO +57', flag: '🇨🇴' },
  { code: '+51', label: 'PE +51', flag: '🇵🇪' },
  { code: '+593', label: 'EC +593', flag: '🇪🇨' },
  { code: '+595', label: 'PY +595', flag: '🇵🇾' },
  { code: '+598', label: 'UY +598', flag: '🇺🇾' },
  { code: '+58', label: 'VE +58', flag: '🇻🇪' },
  { code: '+55', label: 'BR +55', flag: '🇧🇷' },
  { code: '+52', label: 'MX +52', flag: '🇲🇽' },
  { code: '+1', label: 'US/CA +1', flag: '🇺🇸' },
  { code: '+34', label: 'ES +34', flag: '🇪🇸' },
  { code: '+351', label: 'PT +351', flag: '🇵🇹' },
  { code: '+44', label: 'GB +44', flag: '🇬🇧' },
  { code: '+33', label: 'FR +33', flag: '🇫🇷' },
  { code: '+49', label: 'DE +49', flag: '🇩🇪' },
  { code: '+39', label: 'IT +39', flag: '🇮🇹' },
] as const

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  error?: string | null
  label?: string
  id?: string
}

export function PhoneInput({
  value,
  onChange,
  error,
  label = 'WhatsApp',
  id = 'phone',
}: PhoneInputProps) {
  const [prefix, setPrefix] = useState(() => {
    const match = COUNTRY_CODES.find((c) => value.startsWith(c.code))
    return match?.code ?? '+591'
  })
  const [number, setNumber] = useState(() => {
    const match = COUNTRY_CODES.find((c) => value.startsWith(c.code))
    if (match) {
      return value.slice(match.code.length).replace(/[^0-9]/g, '')
    }
    return value.replace(/[^0-9]/g, '')
  })

  const updateValue = (nextPrefix: string, nextNumber: string) => {
    const cleaned = nextNumber.replace(/[^0-9]/g, '')
    setNumber(cleaned)
    onChange(`${nextPrefix}${cleaned}`)
  }

  const handlePrefixChange = (nextPrefix: string) => {
    const valid = COUNTRY_CODES.find((c) => c.code === nextPrefix)
    if (!valid) return
    setPrefix(nextPrefix as (typeof COUNTRY_CODES)[number]['code'])
    updateValue(nextPrefix, number)
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^0-9]/g, '')
    setNumber(cleaned)
    onChange(`${prefix}${cleaned}`)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Select value={prefix} onValueChange={handlePrefixChange}>
          <SelectTrigger className="w-[110px] shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_CODES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                <span className="flex items-center gap-1.5">
                  <span>{c.flag}</span>
                  <span>{c.code}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="Num. de celular"
          value={number}
          onChange={handleNumberChange}
          className={cn(error && 'border-destructive')}
        />
      </div>
    </div>
  )
}
