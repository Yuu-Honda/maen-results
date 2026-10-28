# RNA項目と遺伝子の対応監査：二社の検査記録

2026-10-28。[日本語の結果](../rna.html#gene-correspondence) / [English](../rna-en.html#gene-correspondence) / [公開集計](../data/rna-gene-correspondence.json)。

22,537項目のうち22,484が別研究の公開注釈のProbe_Nameと厳密一致し、53は未対応。旧978遺伝子は両ID一致候補976、Entrezのみ2。両ID一致の864は1 probe、112は複数probe。Probe_IDの全未対応も別記した。これはそのliteral keyでの不一致を表し、遺伝子の未測定を示すものではない。

実ラベル照合前に計画・コード等15ファイルを独立Codexと実際のClaudeが静的検査し、両方PASS。登録commit `3c61c04536222bb6afaa754fd22160c3c4a2d755` のGitHub20ファイルのbyte確認後、専用directoryへ一度実行した。保存countのデータ行の先頭labelと、形式照合用の105試料列名を含むheaderをdecodeした。数値payloadはbytesのまま通過し、数値への変換・集計・再採点はない。個別列名や対応台帳は公開しない。

別の実装が元先頭列を再抽出し、private/public全1,845,379項目に差分0。これは同じデータを使った実装検算であり、独立した生物実験ではない。

公開v1では独立CodexがPASS、実Claudeが説明の2点に修正を要求した。headerも読んだことの明記と、Probe_ID未対応を未測定と混同しない説明を日英・結果文書へ追記した。未修正版は公開していない。

公開v2は独立Codex・実Claude（Opus5.5中）の両方PASS。最終39ファイルの対応表SHA256は `b73af474a51f8b3bafea561df1170d4f52270e427e8cc73a45b7c3e55b1627f0`。Claudeは既読v1を前提とした静的な差分レビューで、旧HTML本文・変更のない証跡を全文再読したものではない。hash再計算、コード実行、実入力の再計算、ブラウザ検査をClaudeが独立に行ったとは扱わない。独立Codex側は実ファイル・日英120表セル・復元と保持の証跡を照合した。必須の未解決指摘は0。見た目や記録の説明に関する任意コメントは履歴に残した。

テストは772件中771成功・元NCI入力を開く1件は明示skip。文言修正後に最終builderのhashを記録した8件を再実行し全成功。最終画面は日英・320/375/768/1440幅・JavaScript有無・動きを減らす設定有無の32条件が全て成功。既存スクロールの進む・戻る・停止と、新節から元の図へ戻る動作を確認した。旧8集計、6CSS/JS、旧14/22および今回15 sourceは保持した。新節とnavを除くと旧HTMLへbyte単位で戻る。

公開JSONのSHA256は `1e34ef4c4c2821c4d8edfadd7a97edc5b24eb5b92b7c82ce48cee7888e215192`。元研究のmanifest・lookup table・配列・lot、研究間尺度、複数probeの集約は未確認・未実施。食品・人体到達・抗がんや治療の効果は評価していない。二社によるソフトウェアと説明の点検は、専門家の生物学的査読や効果の証明とは別である。

出典は別研究[GSE288929](https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE288929)の[注釈原本（CSV.gz、約0.9MB）](https://ftp.ncbi.nlm.nih.gov/geo/series/GSE288nnn/GSE288929/suppl/GSE288929_httr_atlas_probes.csv.gz)と、保存した[LINCS2020 geneinfo（text、約1.1MB）](https://s3.amazonaws.com/macchiato.clue.io/builds/LINCS2020/geneinfo_beta.txt)。入力のhashは公開集計のprovenanceに保存している。
