import * as React from "react"
import { cn } from "../../lib/utils"

/**
 * Card component props
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Card component for displaying content in a contained, styled box
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

/**
 * CardHeader component props
 */
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * CardHeader component for the top section of a card
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

/**
 * CardTitle component props
 */
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * CardTitle component for the main heading of a card
 */
const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

/**
 * CardDescription component props
 */
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * CardDescription component for secondary text in a card header
 */
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

/**
 * CardContent component props
 */
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * CardContent component for the main content area of a card
 */
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

/**
 * CardFooter component props
 */
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * CardFooter component for the bottom section of a card
 */
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }