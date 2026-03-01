export default function ExternalLink({children, href}: {children: React.ReactNode, href: string}) {
    return <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-teal-700 hover:underline"
    >
        {children}
    </a>
}
