# 次のRNA比較の入力対応監査 — 2026-10-21

公開対象は、旧資料と2020再処理版のmetadata対応と未実施理由です。新しいRNA数値照合の結果ではありません。

- 4成分35記録：署名ID29件、全反復集合まで一致27件。2成分15記録でも14件、13件で、全入力一致の条件を満たしません。さらに対象を減らして実行していません。
- 新しい成功率・MRRは未算出。旧185/210、47/210、測定IDだけの210/210、全8成分の記録を保持しています。同じBroad/L1000基盤の再処理であり、別施設の独立実験ではありません。問い合わせ側の元実験は既使用です。
- 独立Codexがmetadata件数・化学対応・公開範囲・旧資産保持を検査しました。実際のClaudeは初回に、化学状態の区別とレビュー範囲の記録に必須修正2件を指摘。適格性と構造・化学ID一致を別項目にし、不在・別形・立体指定不整合・参照形の対象外を分けました。修正後の独立Codex検査はPASSです。実Claude Opus 5.5 中の最終静的再検査もPASS（必須P1/P2各0）。「上の8成分の表と結果」の位置を実HTMLで確認しました。
- 全381テスト成功に加え、実登録metadataで数値入口が停止し、RangeSource呼出しと試行作成が0件となる回帰テストが成功しました。合成データの成功は科学的な独立検証ではありません。
- 日英×5幅×通常／JavaScript無効／動きを減らす設定の30条件・2,310項目を確認しました。印刷・表の横スクロール・既存の進む／戻る／止まるスクロール説明と4導線も確認。最後の変更は化学状態JSONとHTML内のhashだけで、表示を変えず局所追補で照合しました。

今回のAI二社の検査範囲は **停止・実装・記録と公開文面** です。数値実行の承認へ転用できません。新しい数値実行freezeは作っていません。専門家の査読、独立実験、治療の有効性や安全性の確認を代替しません。

新しい行列の取得はHDF5 magic先頭8 byteだけで、RNAベクトルは開いていません。約465 MBの署名metadata取得とRNA値取得を分けています。公開するのは集計・状態・出典・hashだけです。完全な署名・反復ID、個別条件・ベクトル・順位は公開サイトに含めません。

公開集計SHA256：`e92edd1f66b5643d0b70fc3579a9b8d883b6f36e5450cbe7e7bad297274a1fdf`。

English: The complete metadata correspondence gate was not met. Neither proposal was run, and no new RNA retrieval rate or MRR exists. Actual Claude identified two required reporting corrections, both applied; independent Codex rechecked them. The final actual Claude static review passed with no mandatory findings. The position of the existing eight-row table and prior results was verified in both HTML files. This review covers stopping, implementation, records and publication wording, and cannot authorize a numerical run. Prior results and all eight references are retained.
