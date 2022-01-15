import { memo, useState } from "react";
import { AssetFinder } from "../components/asset-finder";
import { Asset, AssetList } from "../components/assets";
import { Button } from "../components/button";

export function DashboardPage() {
    const [assets, setAssets] = useState<(Asset)[]>([])
    const handle_onAssetFound = (asset: Asset) => {
        if (assets.find(x => x.address.toLowerCase() === asset.address.toLowerCase()))
            return
        setAssets([...assets, asset])
    }
    const handle_selectionChanged = () => {
        setAssets(assets)
    }

    const selectedAssets = assets.filter(x => x.selected)
    return (
        <section>
            <h1>
                Mint
            </h1>
            <div>
                <AssetFinder onAssetFound={handle_onAssetFound} />
                <AssetList assets={assets} selectionChanged={handle_selectionChanged} />
            </div>
            <div>
                <Button onClick={() => { }} disabled={!selectedAssets || selectedAssets.length == 0}>Mint with {selectedAssets.length} assets</Button>
            </div>
        </section>
    )
}