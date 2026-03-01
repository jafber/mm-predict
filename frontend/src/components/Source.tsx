import ExternalLink from "./ExternalLink";

export default function Source({href, num}: {href: string, num: number}) {
    return (
        <ExternalLink href={href}>
            <sup className="font-semibold">{num}</sup>
        </ExternalLink>
    )
}
