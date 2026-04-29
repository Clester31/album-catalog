import { CatalogType } from "@/lib/types/types";

export default function CatalogSidebarItem({ catalog, onSelect }: { catalog: CatalogType, onSelect: (catalog: CatalogType) => void}) {
    return (
        <div className={`flex flex-row justify-between items-center bg-white/10 p-2 hover:bg-accent transition 100 ease-in-out cursor-pointer`} style={{ borderLeft: `.25rem solid ${catalog.catalogColor}` }} onClick={() => onSelect(catalog)}>
            <h1 className="text-md w-2/3 truncate">{catalog.catalogTitle}</h1>
            <p className="text-white/50 text-xs">{catalog.entry?.length ?? '0'} items</p>
        </div>
    )
}