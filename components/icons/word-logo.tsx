export default function WordLogo({ isDark }: { isDark: boolean }) {
   return (
      <span>
         <p
            className={`inline font-bold text-2xl tracking-normal ${isDark ? "text-black" : "text-white"}`}
         >
            WANMI
         </p>
         <p className="inline font-extrabold text-3xl text-red-500">.</p>
      </span>
   );
}
