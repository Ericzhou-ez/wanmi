"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cn } from "lib/utils";
import * as React from "react";

const NavigationMenu = React.forwardRef<
   React.ElementRef<typeof NavigationMenuPrimitive.Root>,
   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(
   (
      {
         className,
         children,
         delayDuration = 0,
         skipDelayDuration = 200,
         ...props
      },
      ref,
   ) => (
      <NavigationMenuPrimitive.Root
         ref={ref}
         delayDuration={delayDuration}
         skipDelayDuration={skipDelayDuration}
         className={cn(
            "relative isolate z-10 flex max-w-max flex-1 items-center",
            className,
         )}
         {...props}
      >
         {children}
         <NavigationMenuViewport />
      </NavigationMenuPrimitive.Root>
   ),
);
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
   React.ElementRef<typeof NavigationMenuPrimitive.List>,
   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
   <NavigationMenuPrimitive.List
      ref={ref}
      className={cn(
         "group flex flex-1 list-none items-center justify-start gap-x-6 md:gap-x-8",
         className,
      )}
      {...props}
   />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle =
   "group relative z-10 inline-flex items-center bg-transparent px-0 py-0.5 text-[0.86rem] nav-menu-trigger text-neutral-800 underline decoration-transparent decoration-2 underline-offset-4 transition-[text-decoration-color,color] duration-75 ease-out hover:text-neutral-950 hover:underline hover:decoration-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/25 focus-visible:ring-offset-2 data-[state=open]:focus-visible:ring-0 data-[state=open]:focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-neutral-950 data-[state=open]:underline data-[state=open]:decoration-red-500";

const NavigationMenuTrigger = React.forwardRef<
   React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
   <NavigationMenuPrimitive.Trigger
      ref={ref}
      className={cn(navigationMenuTriggerStyle, className)}
      {...props}
   >
      {children}
   </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
   React.ElementRef<typeof NavigationMenuPrimitive.Content>,
   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
   <NavigationMenuPrimitive.Content
      ref={ref}
      className={cn(
         "left-0 top-0 w-full bg-transparent p-0 shadow-none transition-opacity duration-75 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 md:absolute md:left-0 md:w-full",
         className,
      )}
      {...props}
   />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
   React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
   React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
   <div
      className={cn(
         "absolute left-0 top-full z-50 w-screen max-w-[100vw] shrink-0",
         /* Full-bleed dropdown while triggers stay in the content column */
         "ml-[calc(50%-50vw)]",
      )}
   >
      <NavigationMenuPrimitive.Viewport
         className={cn(
            "origin-top-center relative mt-0 h-[var(--radix-navigation-menu-viewport-height)] w-full max-w-none overflow-hidden bg-transparent shadow-none transition-[opacity,transform] duration-75 data-[state=closed]:translate-y-px data-[state=closed]:opacity-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100",
            className,
         )}
         ref={ref}
         {...props}
      />
   </div>
));
NavigationMenuViewport.displayName =
   NavigationMenuPrimitive.Viewport.displayName;

export {
   NavigationMenu,
   NavigationMenuContent,
   NavigationMenuItem,
   NavigationMenuLink,
   NavigationMenuList,
   NavigationMenuTrigger,
   navigationMenuTriggerStyle,
};
