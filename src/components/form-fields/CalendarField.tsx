"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { useFormContext, Controller } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface CalendarFieldProps {
  name: string
  label?: string
  required?: boolean
}

export function CalendarField({ name, label = "Date of Birth", required }: CalendarFieldProps) {
  const { control } = useFormContext()
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-all",
                  "focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value ? format(field.value, "PPP") : "Select date"}
                <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date)
                  setOpen(false)
                }}
                captionLayout="dropdown-buttons"
                fromYear={1930}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  )
}
