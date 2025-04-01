import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import type { NewsArticle } from "@/types/news"

interface NewsCardProps {
  article: NewsArticle
}

export function NewsCard({articled,id}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  console.log(articled,'atcikdfjlsdj')

  // console.log(url:"articled?.url",title:"articled?.title",desc:"articled.description",)
  return (
    <Card className="overflow-hidden" key={id}>
      <CardContent className="p-4">
        <CardTitle className="text-base mb-2">
          <a
            href={articled?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-start gap-1"
          >
            {articled?.title}
            <ExternalLink className="h-3 w-3 mt-1 flex-shrink-0" />
          </a>
        </CardTitle>
        <CardDescription className="line-clamp-2 mb-2">{articled.description}</CardDescription>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{articled?.source?.name}</span>
          <span>{formatDate(articled?.publishedAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

