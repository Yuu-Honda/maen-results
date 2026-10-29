(() => {
  'use strict';
  // Tap-to-explain glossary. Static pages stay readable without JavaScript;
  // this script only turns the first use of each listed term in a section into
  // a button that opens a short definition. Definitions follow the reviewed
  // wording on this site (for example, a primary hit is not cell death).
  const main = document.querySelector('main');
  if (!main) return;
  const english = document.documentElement.lang.startsWith('en');

  // [id, Japanese matches, English matches, ja {t,d,e?,s?}, en {t,d,e?,s?}]
  // t: heading, d: definition, e: everyday picture, s: how this site uses it.
  const TERMS = [
    ['cell-line', ['細胞株'], ['cell lines', 'cell line'],
      {t: '細胞株', d: '患者のがん組織などから取り出し、実験室で増え続けられるようにした細胞の系統。同じ名前の株なら、世界中の研究室でほぼ同じ細胞を使えます。', e: '同じ「品種」の細胞を、みんなで共有しているイメージ。', s: '培養皿の中の細胞です。人の体の中とは環境がまったく違います。'},
      {t: 'Cell line', d: 'Cells taken from a tumour or other tissue and adapted to keep growing in the lab. Labs around the world can work with essentially the same cells under one name.', e: 'Like a shared "variety" of cells that everyone can grow.', s: 'Cells in a dish, not cells inside a human body.'}],
    ['primary-hit', ['一次 hit', '一次hit'], ['primary hits', 'primary hit', 'primary-hit'],
      {t: '一次 hit', d: '最初の大規模な測定（一次スクリーニング）で、薬なしの対照と比べた生細胞量の指標が30%未満になった細胞株。', e: '「この株では数値が大きく下がった」という最初の目印です。', s: '増殖が止まったのか、細胞が死んだのかは区別していません。「殺した」という意味ではありません。'},
      {t: 'Primary hit', d: 'A cell line whose viable-cell signal fell below 30% of the vehicle control in the first large screen.', e: 'A first flag: "the signal dropped a lot in this line".', s: 'It does not separate growth arrest from cell death, so it does not mean the cells were killed.'}],
    ['viability', ['生細胞量'], ['viable-cell signal', 'viability'],
      {t: '生細胞量の指標（viability）', d: '生きている細胞がどれだけあるかの目安。PRISMでは、細胞ごとに付けた目印（DNAバーコード）の量から推定します。', e: '薬を入れた皿と入れない皿で、残っている細胞の量を比べるイメージ。', s: '細胞が増えなくなっても、死んでも、この値は下がります。'},
      {t: 'Viability signal', d: 'A proxy for how many living cells remain. PRISM estimates it from the amount of a DNA barcode attached to each cell line.', e: 'Comparing how many cells remain in a treated dish versus an untreated one.', s: 'It falls both when cells stop growing and when they die.'}],
    ['positive-control', ['陽性対照'], ['positive controls', 'positive control', 'positive-control'],
      {t: '陽性対照', d: '「手順がうまく働けば、こうなるはず」と前もって分かっている例。方法の動作確認に使います。', e: '新しい体重計に、重さの分かっている1 kgのおもりを載せて確かめるようなもの。', s: '結果を見る前に、どの例が通るはずかを決めてあります。'},
      {t: 'Positive control', d: 'An example whose expected result is known in advance. It checks that the method can find a known effect.', e: 'Like weighing a known 1 kg weight on a new scale.', s: 'The expected examples were chosen before looking at the results.'}],
    ['control', ['対照'], ['vehicle control', 'controls', 'control'],
      {t: '対照', d: '比べるための基準になる条件やデータ。結果が偶然や測り方の癖ではないかを確かめるために置きます。', e: '薬の効果を見るなら、薬を入れない皿（溶媒だけ）と並べて比べる。', s: '「薬なしの対照」「値を入れ替えた対照」など、何と比べたかを毎回書いています。'},
      {t: 'Control', d: 'A reference condition or dataset used for comparison, so that a result is not just chance or a quirk of the measurement.', e: 'To see a drug’s effect, compare with a dish that only got the solvent.', s: 'Each result states what it was compared with, such as a vehicle control or a shuffled control.'}],
    ['shuffle', ['入れ替え', '入替え'], ['permutations', 'permutation', 'permuted', 'shuffled', 'shuffle'],
      {t: '入れ替え（シャッフル）対照', d: '値と細胞（や遺伝子）の対応をわざとバラバラにしたデータで、同じ計算をやり直すこと。', e: 'くじの当たり札を混ぜ直しても同じくらい当たるなら、本当の関係とは言いにくい。', s: '本物のデータが、偶然でもこれくらいは出る、という目安を上回るかを見ます。'},
      {t: 'Shuffled (permutation) control', d: 'The same calculation repeated after deliberately scrambling which value belongs to which cell line or gene.', e: 'If reshuffled lottery tickets win just as often, the pattern is probably not real.', s: 'It shows how much could appear by chance alone, as a yardstick for the real data.'}],
    ['auc', ['AUC'], ['AUC'],
      {t: 'AUC（曲線下面積）', d: '薬の濃度を変えて測った生細胞量の曲線の、下側の面積。', e: '少ない量から数値が下がるほど、面積は小さくなります。', s: 'このサイトでは、AUCが低いほど「効きやすい（感受性が高い）」株です。'},
      {t: 'AUC (area under the curve)', d: 'The area under the viability curve measured across drug concentrations.', e: 'The earlier the signal drops as dose rises, the smaller the area.', s: 'Here, a lower AUC means a more sensitive cell line.'}],
    ['ic50', ['IC50'], ['IC50'],
      {t: 'IC50', d: '細胞の応答（生細胞量など）が半分になる薬の濃度の推定値。小さいほど、少ない量で効いています。', e: '「半分に下げるには、どれだけ薄くても足りるか」。', s: '培養細胞での値です。人の血液中で届く濃度とは照合していません。'},
      {t: 'IC50', d: 'The estimated drug concentration that halves a response such as viable-cell signal. Smaller means effective at lower amounts.', e: '"How dilute can it be and still halve the signal?"', s: 'Measured in cultured cells; not compared with concentrations reached in human blood.'}],
    ['gi50', ['GI50'], ['GI50'],
      {t: 'GI50', d: '細胞の増殖を50%抑える薬の濃度。米国立がん研究所（NCI）の細胞パネルで使われる指標です。', s: 'IC50とは測っているもの（エンドポイント）が違うので、そのまま比べられません。'},
      {t: 'GI50', d: 'The drug concentration that inhibits cell growth by 50%, the measure used in the US National Cancer Institute (NCI) panel.', s: 'It measures a different endpoint from IC50, so the two are not directly interchangeable.'}],
    ['p-conc', ['pGI50', 'pIC50'], ['pGI50', 'pIC50'],
      {t: 'pGI50・pIC50', d: '濃度（モル）を −log10 で変換した値。数字が1大きいと、10分の1の濃度で効くという意味です。', e: 'pH と同じ考え方の目盛り。大きいほど「少量で効く」。', s: '予測と実測のずれ（MAE）も、この目盛りで測っています。'},
      {t: 'pGI50 / pIC50', d: 'Concentration in molar converted with −log10. One unit higher means effective at a tenfold lower concentration.', e: 'A scale like pH: bigger means effective at smaller amounts.', s: 'Prediction error (MAE) is measured on this scale.'}],
    ['mae', ['MAE'], ['MAE'],
      {t: 'MAE（平均絶対誤差）', d: '予測と実測の差の大きさ（プラス・マイナスを無視）を平均した値。小さいほど予測が実測に近い。', e: '天気予報の気温が、平均して何度ずれていたか。'},
      {t: 'MAE (mean absolute error)', d: 'The average size of the gap between prediction and measurement, ignoring direction. Smaller is closer.', e: 'How many degrees a weather forecast was off, on average.'}],
    ['separation', ['分離度'], ['separation'],
      {t: '分離度', d: '一次 hit の株と、それ以外の株から1つずつ選んだとき、hit 側のAUCのほうが低い（効きやすい）確率。同じなら0.5と数えます。', e: '0.5 なら2つの群はごちゃ混ぜ、1 ならきれいに分かれている。', s: '比べているのは相対的な順位です。同じ株が再び30%未満になったことや、細胞死の再現ではありません。'},
      {t: 'Separation', d: 'Pick one primary-hit line and one other line at random: the probability that the hit line has the lower AUC (ties count 0.5).', e: '0.5 means the two groups are mixed; 1 means they are cleanly split.', s: 'It compares relative ranks only. It is not a repeat of the 30% threshold or of cell death.'}],
    ['interval', ['95%区間', '95% 区間'], ['95% intervals', '95% interval'],
      {t: '95%区間', d: 'データのばらつきから見た、推定値の不確かさの幅。', e: '区間が 0（差なし）や 0.5（順位差なし）をまたいでいたら、差があるとは言い切れない。', s: 'このサイトでは主に bootstrap で計算しています。'},
      {t: '95% interval', d: 'The range of uncertainty around an estimate, based on how much the data vary.', e: 'If it crosses 0 (no difference) or 0.5 (no rank difference), a difference is not established.', s: 'Mostly computed by bootstrap on this site.'}],
    ['bootstrap', ['bootstrap'], ['bootstrap'],
      {t: 'bootstrap（ブートストラップ）', d: '手元のデータから重複を許して何度も抜き出し直し、そのたびに計算し直して、結果のぶれを見積もる方法。', e: '同じ袋から玉を戻しながら何百回も引き、平均がどれだけ揺れるかを見る。'},
      {t: 'Bootstrap', d: 'Resample the data with replacement many times and recompute each time, to estimate how much a result could wobble.', e: 'Drawing balls from the same bag hundreds of times, putting each back.'}],
    ['rank-corr', ['順位相関', 'Spearman ρ', 'Spearman'], ['rank correlation', 'Spearman ρ', 'Spearman'],
      {t: '順位相関（Spearman ρ）', d: '2つの並び順がどれだけそろっているかの指標。−1〜1で、1は完全に同じ順、0は並びに一貫した関係がない、−1は逆順。', e: '2人の審査員がつけた順位表が、どれだけ一致しているか。', s: '的中率や治療効果ではありません。'},
      {t: 'Rank correlation (Spearman ρ)', d: 'How well two orderings agree, from −1 to 1: 1 is the same order, 0 means no consistent relationship, −1 is reversed.', e: 'How closely two judges’ ranking lists agree.', s: 'It is not an accuracy rate or a treatment effect.'}],
    ['macro-rho', ['macro ρ'], ['macro ρ'],
      {t: 'macro ρ', d: '薬ごとに計算した順位相関 ρ を、薬の数で単純に平均した値。', e: '6薬剤なら、6つの ρ を足して6で割る。'},
      {t: 'Macro ρ', d: 'The rank correlation ρ computed per drug, then averaged equally across drugs.', e: 'For six drugs: add the six ρ values and divide by six.'}],
    ['prereg', ['事前登録', '事前に固定'], ['pre-registration', 'pre-registered', 'pre-register'],
      {t: '事前登録', d: '結果を見る前に、方法と判定基準を固定して記録しておくこと。', e: '試合の前にルールを決めておけば、後から都合よく変えられない。', s: 'このサイトでは、固定した時点を git の commit で残しています。'},
      {t: 'Pre-registration', d: 'Fixing and recording the method and pass criteria before seeing the results.', e: 'Agreeing the rules before the match, so they cannot be bent afterwards.', s: 'This site records the freeze point as a git commit.'}],
    ['p-value', ['p値'], ['p-values', 'p-value'],
      {t: 'p値', d: '「本当は何の差もない」と仮定したとき、偶然だけで今回以上の結果が出る確率の目安。', s: 'このサイトの結果では、候補ごとのp値は計算していません。'},
      {t: 'p-value', d: 'Assuming there is truly no effect, the chance of seeing a result at least this extreme by luck alone.', s: 'Results on this site do not report per-candidate p-values.'}],
    ['fdr', ['FDR'], ['FDR'],
      {t: 'FDR（偽発見率）', d: '「当たり」として選んだもののうち、実は偽物が混ざっている割合の見込み。', e: '100件選んでFDR 10%なら、約10件は空振りかもしれない。', s: 'この研究では推定していません。'},
      {t: 'FDR (false discovery rate)', d: 'The expected share of false positives among the results called hits.', e: 'Pick 100 with a 10% FDR and about 10 may be misses.', s: 'Not estimated in this work.'}],
    ['tpr', ['真陽性率'], ['true-positive rates', 'true-positive rate', 'true-positive'],
      {t: '真陽性率', d: '候補として選ばれたものが、本当に効果をもつ確率（またはその割合）。', s: 'この研究では推定していません。'},
      {t: 'True-positive rate', d: 'The probability (or share) that selected candidates truly have the effect.', s: 'Not estimated in this work.'}],
    ['prism', ['PRISM'], ['PRISM'],
      {t: 'PRISM', d: 'Broad研究所の公開データ。数百のがん細胞株に目印（DNAバーコード）を付けて混ぜ、数千の化合物で一度に生細胞量を測った大規模実験です。', s: 'このサイトでは Repurposing 19Q4 版（CC BY 4.0）を使っています。'},
      {t: 'PRISM', d: 'A public Broad Institute dataset: hundreds of barcoded cancer cell lines pooled together and tested against thousands of compounds at once.', s: 'This site uses the Repurposing 19Q4 release (CC BY 4.0).'}],
    ['ctrp', ['CTRP'], ['CTRP'],
      {t: 'CTRP', d: 'Cancer Therapeutics Response Portal。PRISMとは別の測定法で、多数のがん細胞株と化合物の感受性を測った公開データ。', s: '同じBroad研究所の多くの細胞株を共有するため、「別の研究室」ではなく「別の測定法」での確認です。'},
      {t: 'CTRP', d: 'Cancer Therapeutics Response Portal: public sensitivity data for many cancer cell lines and compounds, measured with a different assay from PRISM.', s: 'It shares many cell lines and the Broad Institute with PRISM: a different assay, not a different lab.'}],
    ['gdsc', ['GDSC1', 'GDSC'], ['GDSC1', 'GDSC'],
      {t: 'GDSC', d: 'Genomics of Drug Sensitivity in Cancer。英国サンガー研究所などが公開している、がん細胞株の薬剤感受性データ。', s: 'NCIで学んだ予測を、学習に使っていない外部データとして確かめるのに使いました。'},
      {t: 'GDSC', d: 'Genomics of Drug Sensitivity in Cancer: public drug-sensitivity data for cancer cell lines from the Wellcome Sanger Institute and partners.', s: 'Used as external data, never seen during training, to test predictions learned on NCI data.'}],
    ['nci60', ['NCI-60'], ['NCI-60'],
      {t: 'NCI-60', d: '米国立がん研究所（NCI）が長年使ってきた、約60種類のがん細胞株のセット。'},
      {t: 'NCI-60', d: 'A long-used panel of about 60 cancer cell lines from the US National Cancer Institute.'}],
    ['mcf7', ['MCF7'], ['MCF7'],
      {t: 'MCF7', d: '乳がん由来の、研究で最もよく使われる細胞株の一つ。'},
      {t: 'MCF7', d: 'A breast-cancer cell line, one of the most widely used in research.'}],
    ['replicate', ['生物学的反復', '反復'], ['biological replicates', 'biological replicate', 'replicates', 'replicate'],
      {t: '反復（生物学的反復）', d: '同じ条件の実験を、別に育てた細胞で独立にもう一度行ったもの。', e: '同じレシピで、別の日にもう一度ケーキを焼く。', s: 'タンパク質の逆検索では、一方の反復で測った変化から、もう一方の反復の記録を探せるかを確かめています。'},
      {t: 'Replicate (biological replicate)', d: 'The same experiment repeated independently on separately grown cells.', e: 'Baking the same recipe again on another day.', s: 'The protein reverse search tests whether a change measured in one replicate finds its record in the other.'}],
    ['topk', ['Top 1', 'Top 5'], ['Top 1', 'Top 5'],
      {t: 'Top 1・Top 5', d: '検索で、正解（元の条件）が1位に来た割合、5位以内に入った割合。', e: '検索エンジンで、探していたページが1番上に出るか、最初の5件に入るか。'},
      {t: 'Top 1 / Top 5', d: 'The share of searches where the correct answer ranks first, or within the first five.', e: 'Whether the page you wanted is the first search result, or on the first five.'}],
    ['mrr', ['平均逆順位', 'MRR'], ['mean reciprocal rank', 'MRR'],
      {t: 'MRR（平均逆順位）', d: '正解の順位の逆数を平均した値。1位なら1、2位なら0.5、4位なら0.25。1に近いほど上位に戻っています。', s: '成功率や治療効果ではありません。'},
      {t: 'MRR (mean reciprocal rank)', d: 'The average of 1/rank of the correct answer: 1 for first, 0.5 for second, 0.25 for fourth. Closer to 1 is better.', s: 'Not a success rate or treatment effect.'}],
    ['missing', ['欠測'], ['missingness'],
      {t: '欠測', d: '測定で値が得られなかった部分。', e: 'どこが空欄かという並び方だけでも、どの測定グループかが分かってしまうことがあります。', s: 'このため「欠測の位置だけ」で検索する対照も並べて示しています。'},
      {t: 'Missingness', d: 'Which values could not be measured.', e: 'The pattern of blanks alone can reveal which measurement batch a sample came from.', s: 'That is why a missingness-only control is shown next to the main result.'}],
    ['tmt', ['TMT'], ['TMT'],
      {t: 'TMT', d: 'タンパク質量を、複数の試料でまとめて測るための目印（標識）の方法。', s: '同じ測定グループの試料は似た癖を持ちやすく、検索の手がかりに混ざることがあります。'},
      {t: 'TMT', d: 'A labelling method for measuring protein amounts in several samples at once.', s: 'Samples in the same TMT group share quirks that can leak into a search.'}],
    ['dmso', ['DMSO'], ['DMSO'],
      {t: 'DMSO', d: '薬を溶かすのによく使う溶媒。薬を入れない比較用の条件（対照）にも使われます。'},
      {t: 'DMSO', d: 'A common solvent for dissolving drugs, also used alone as the no-drug comparison (control).'}],
    ['targeted', ['分子標的薬'], ['targeted drugs', 'targeted drug'],
      {t: '分子標的薬', d: 'がんの増殖に関わる特定の分子（標的）を狙うよう設計された薬。'},
      {t: 'Targeted drug', d: 'A drug designed to act on a specific molecule (target) involved in cancer growth.'}],
    ['braf', ['BRAF'], ['BRAF'],
      {t: 'BRAF', d: '細胞の増殖シグナルに関わる遺伝子。メラノーマの一部で変異していて、vemurafenib や dabrafenib はその変異型を狙う薬です。', s: '今回の細胞株では BRAF 変異の有無は照合していません。'},
      {t: 'BRAF', d: 'A gene in a cell-growth signalling pathway. It is mutated in some melanomas, and vemurafenib and dabrafenib target the mutant form.', s: 'BRAF mutation status of the cell lines was not checked here.'}],
    ['melanoma', ['メラノーマ'], ['melanoma'],
      {t: 'メラノーマ', d: '皮膚などの色素をつくる細胞から生じるがん。', s: '「皮膚由来（skin）」の注釈だけでは、メラノーマとは確認できません。'},
      {t: 'Melanoma', d: 'A cancer arising from pigment-producing cells, most often in the skin.', s: 'A "skin" tissue annotation alone does not confirm melanoma.'}],
    ['launched', ['Launched'], ['Launched'],
      {t: 'Launched', d: '旧Repurposing Hubの注釈で、どこかで承認・発売された記録がある段階。', s: '現在の承認状況、国、人用か動物用かは照合していません。'},
      {t: 'Launched', d: 'A historical Repurposing Hub label meaning a record of approval or marketing somewhere.', s: 'Current approval, country and human versus veterinary use were not checked.'}],
    ['hub', ['Repurposing Hub', '旧Hub'], ['Repurposing Hub'],
      {t: 'Repurposing Hub', d: 'Broad研究所が公開した、既存薬・開発中の化合物の一覧と注釈（標的・用途・開発段階など）。', s: 'ここで使ったのは過去の版の注釈です。'},
      {t: 'Repurposing Hub', d: 'A Broad Institute list of approved and investigational compounds with annotations such as target, use and stage.', s: 'The annotations used here are historical.'}],
    ['repurposing', ['転用'], ['repurposing'],
      {t: '転用（ドラッグ・リパーパシング）', d: 'すでに別の病気で使われている薬や、開発された化合物に、新しい用途がないかを探すこと。', s: 'ここでの結果は培養細胞での手がかりで、人での効果は確かめていません。'},
      {t: 'Drug repurposing', d: 'Looking for new uses of drugs already used for other diseases, or of compounds already developed.', s: 'Results here are leads in cultured cells; effects in people were not tested.'}],
    ['micromolar', ['µM'], ['µM'],
      {t: 'µM（マイクロモーラー）', d: '濃度の単位。1リットルに100万分の1モルの物質が溶けている濃さ。', s: '培養皿での濃度です。人の体内で同じ濃度に届くかは別の問題です。'},
      {t: 'µM (micromolar)', d: 'A concentration unit: one millionth of a mole per litre.', s: 'Concentrations in a dish; whether a body reaches them is a separate question.'}],
    ['cv', ['内部CV'], ['internal CV', 'cross-validation'],
      {t: '内部CV（交差検証）', d: '学習用データの一部を隠して予測を試し、調整がうまくいっているかを確かめる方法。', e: '練習問題の一部を伏せて、本番前に自分を試す。'},
      {t: 'Internal CV (cross-validation)', d: 'Hide part of the training data, predict it, and use that to check or tune the model.', e: 'Covering some practice questions to test yourself before the exam.'}],
    ['shrinkage', ['shrinkage'], ['shrinkage'],
      {t: 'shrinkage（縮小推定）', d: 'データの少ないグループの推定値を全体の平均に引き寄せ、極端な値を抑える調整。', e: '2試合だけの打率10割を、そのまま信じすぎない工夫。'},
      {t: 'Shrinkage', d: 'Pulling estimates for small groups toward the overall average to tame extreme values.', e: 'Not over-trusting a 1.000 batting average after two games.'}],
    ['endpoint', ['エンドポイント'], ['endpoints', 'endpoint'],
      {t: 'エンドポイント', d: '実験で最終的に何を測ったかという指標。', e: '「48時間後の増殖」と「72時間後の生細胞量」は、別のものさしです。'},
      {t: 'Endpoint', d: 'What an experiment finally measures.', e: '"Growth after 48 hours" and "viability after 72 hours" are different rulers.'}],
    ['origin-group', ['由来群'], ['origin groups', 'origin group'],
      {t: '由来群', d: '同じ患者や同じ元の細胞から派生した細胞モデルをまとめた単位。', s: '実質的に同じ細胞を二重に数えないために使います。'},
      {t: 'Origin group', d: 'Cell models derived from the same patient or the same parent cells, grouped together.', s: 'Used so that essentially the same cells are not counted twice.'}],
    ['signature', ['署名'], ['signatures', 'signature'],
      {t: '署名（シグネチャー）', d: 'ある処理をしたとき、細胞に起きた変化のパターン。多数の遺伝子やタンパク質の増減の組み合わせです。', e: '「この薬を入れると、こう変わる」という指紋のようなもの。'},
      {t: 'Signature', d: 'The pattern of change a treatment causes in cells: a combined set of many genes or proteins going up and down.', e: 'A fingerprint of "add this, and the cell changes like this".'}],
    ['lincs', ['LINCS', 'L1000'], ['LINCS', 'L1000'],
      {t: 'LINCS・L1000', d: '多数の化合物で細胞のRNA変化を大規模に測った公開データ（LINCS）と、その測定法（L1000）。約1,000の代表遺伝子を直接測ります。'},
      {t: 'LINCS / L1000', d: 'A large public dataset of RNA changes in cells treated with many compounds (LINCS) and its assay (L1000), which directly measures about 1,000 representative genes.'}],
    ['landmark', ['ランドマーク遺伝子', 'ランドマーク'], ['landmark genes', 'landmarks', 'landmark'],
      {t: 'ランドマーク遺伝子', d: 'L1000で直接測る978個の代表遺伝子。', s: 'このサイトのRNA逆検索は、推定値ではなく、直接測定されたこの遺伝子を使っています。'},
      {t: 'Landmark genes', d: 'The 978 representative genes that L1000 measures directly.', s: 'The RNA reverse lookup on this site uses these directly measured genes, not inferred ones.'}],
    ['modz', ['MODZ'], ['MODZ'],
      {t: 'MODZ', d: 'L1000で、反復ごとのRNA変化（zスコア）を、互いに似ている反復ほど重く平均して1つにまとめる方法。'},
      {t: 'MODZ', d: 'The L1000 method that merges replicate RNA changes (z-scores) into one, weighting replicates that agree with each other more.'}],
    ['z-score', ['zスコア'], ['z-scores', 'z-score'],
      {t: 'zスコア', d: '値が基準からどれだけ離れているかを、ばらつきの大きさ（標準偏差）の何個分かで表したもの。'},
      {t: 'z-score', d: 'How far a value is from a reference, counted in units of typical spread (standard deviations).'}],
    ['inchikey', ['InChIKey'], ['InChIKey'],
      {t: 'InChIKey', d: '化学構造から機械的につくる、分子の識別コード。名前が違っても、同じ構造なら同じコードになります。', s: '名前だけでつながず、構造で同じ分子かを確かめるのに使っています。'},
      {t: 'InChIKey', d: 'An identifier generated from a chemical structure. Different names for the same structure give the same key.', s: 'Used to check that two records are the same molecule, not just the same name.'}],
    ['stereo', ['立体配置', '立体'], ['stereochemistry', 'stereo'],
      {t: '立体（立体配置）', d: '原子のつながりは同じでも、空間での向きが違う分子の形。性質が変わることがあります。', e: '右手と左手のように、同じ部品でも重ならない形。'},
      {t: 'Stereochemistry', d: 'Molecules with the same connections but a different 3D arrangement, which can change their properties.', e: 'Like left and right hands: same parts, not superimposable.'}],
    ['jaccard', ['Jaccard'], ['Jaccard'],
      {t: 'Jaccard 類似度', d: '2つの集合の重なり具合。共通部分の大きさ ÷ 合わせた全体の大きさ。'},
      {t: 'Jaccard similarity', d: 'How much two sets overlap: the shared part divided by the combined whole.'}],
    ['seed', ['seed'], ['seeds', 'seed'],
      {t: 'seed（乱数の種）', d: '乱数の出発点。同じseedを使えば、同じ「ランダム」をもう一度再現できます。'},
      {t: 'Seed', d: 'The starting point of a random number generator. The same seed reproduces the same "random" draw.'}],
    ['fpkm', ['FPKM'], ['FPKM'],
      {t: 'FPKM', d: 'RNAの量を、遺伝子の長さと読み取った総量で補正した値。'},
      {t: 'FPKM', d: 'An RNA amount adjusted for gene length and total sequencing depth.'}],
    ['censor', ['打ち切り'], ['censoring', 'censored'],
      {t: '打ち切り', d: '測定範囲の外にあって、正確な値が分からない状態。', e: '体重計の上限を超えると「150 kg以上」としか分からない。'},
      {t: 'Censoring', d: 'When a value lies outside the measured range, so only a bound is known.', e: 'A scale that only says "over 150 kg".'}],
    ['confound', ['交絡'], ['confounding', 'confounded'],
      {t: '交絡', d: '本当に調べたい要因とは別の要因が結果に混ざり、見かけの関係をつくってしまうこと。', e: 'アイスが売れる日に水難事故が多いのは、暑さという別の要因のせい。'},
      {t: 'Confounding', d: 'When another factor mixes into a result and creates an apparent relationship.', e: 'Ice-cream sales and drownings both rise on hot days.'}],
    ['reverse', ['逆検索', '逆引き'], ['reverse lookup', 'reverse search'],
      {t: '逆検索（逆引き）', d: '「細胞がどう変わったか」から、「何を加えたか」を探すこと。ふつうの「薬 → 変化」を逆向きにたどります。', e: '足跡から、どの動物が通ったかを推理する。', s: '探すのは記録の中の似た変化で、食品や治療の効果ではありません。'},
      {t: 'Reverse lookup', d: 'Going from "how the cells changed" back to "what was added", the opposite of the usual drug → change direction.', e: 'Working out which animal passed from its footprints.', s: 'It finds similar changes in records, not food or treatment effects.'}],
    ['cosine', ['cosine'], ['cosine'],
      {t: 'cosine 類似度', d: '2つの変化パターンの「向き」がどれだけ似ているかを、−1〜1で表す指標。', e: '多くの遺伝子が同じ方向に上がり下がりしていれば1に近づく。'},
      {t: 'Cosine similarity', d: 'How alike the direction of two change patterns is, from −1 to 1.', e: 'Close to 1 when most genes move up and down together.'}],
    ['metadata', ['メタデータ', 'metadata'], ['metadata'],
      {t: 'メタデータ', d: 'データについての説明情報。どの細胞・濃度・時間・測定グループの記録か、など。'},
      {t: 'Metadata', d: 'Information about the data, such as which cell, dose, time and batch a record comes from.'}]
  ];

  const ascii = /[A-Za-z0-9]/;
  const lookup = new Map();
  const entries = new Map();
  TERMS.forEach(([id, ja, en, jaText, enText]) => {
    entries.set(id, english ? enText : jaText);
    (english ? en : ja).forEach(match => {
      lookup.set(match, id);
      // Sentence-initial capitals for English phrases ("Cell lines …").
      if (english && /^[a-z]/.test(match)) lookup.set(match[0].toUpperCase() + match.slice(1), id);
    });
  });
  const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(Array.from(lookup.keys()).sort((a, b) => b.length - a.length).map(escape).join('|'), 'g');
  // ASCII terms must not be part of a longer word ("MAE" inside "MAEN").
  const bounded = (text, start, end) =>
    !(ascii.test(text[start]) && ascii.test(text[start - 1] || '')) &&
    !(ascii.test(text[end - 1]) && ascii.test(text[end] || ''));

  const SKIP = 'a,button,summary,label,select,option,textarea,input,code,pre,kbd,script,style,noscript,svg,table,h1,h2,h3,h4,nav,header,footer,[aria-hidden="true"],[aria-live],[role="status"],[hidden],.ex-controls,.ex-scroll-help,.ex-svg,.signature-panel,.hero-facts,.status-message,.gl-term,.gl-hint,[data-no-gloss],#protein-definition,#protein-primary-label,#protein-primary-count,#protein-uniform-reference';

  const scopeOf = node => node.parentElement.closest('section, article, details') || main;
  const seen = new WeakMap();
  const mark = (node) => {
    // Another script may have replaced this text since it was collected.
    if (!node.isConnected || !node.parentElement) return;
    const text = node.nodeValue;
    pattern.lastIndex = 0;
    const scope = scopeOf(node);
    if (!seen.has(scope)) seen.set(scope, new Set());
    const used = seen.get(scope);
    const pieces = [];
    let last = 0;
    let match;
    while ((match = pattern.exec(text))) {
      const id = lookup.get(match[0]);
      const end = match.index + match[0].length;
      if (used.has(id) || !bounded(text, match.index, end)) continue;
      used.add(id);
      if (match.index > last) pieces.push(document.createTextNode(text.slice(last, match.index)));
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gl-term';
      button.dataset.term = id;
      button.setAttribute('aria-haspopup', 'dialog');
      button.textContent = match[0];
      pieces.push(button);
      last = end;
    }
    if (!pieces.length) return;
    if (last < text.length) pieces.push(document.createTextNode(text.slice(last)));
    node.replaceWith(...pieces);
  };

  const collect = () => {
    const nodes = [];
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
      acceptNode: node => !node.nodeValue.trim() || node.parentElement.closest(SKIP)
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  };

  // Mark in small slices so a long page never blocks a tap or a scroll.
  const idle = window.requestIdleCallback
    ? callback => window.requestIdleCallback(callback, {timeout: 400})
    : callback => window.setTimeout(() => callback({timeRemaining: () => 8}), 16);
  const run = nodes => idle(deadline => {
    while (nodes.length && deadline.timeRemaining() > 2) mark(nodes.shift());
    if (nodes.length) run(nodes);
  });

  // One shared popover: a bottom sheet on small screens, a bubble beside the
  // term on wide screens.
  const words = english
    ? {kicker: 'Term', example: 'Picture it', site: 'On this site', close: 'Close', hint: ['Tap a dotted term, such as ', ', for a short explanation.']}
    : {kicker: '用語', example: 'たとえば', site: 'このサイトでは', close: '閉じる', hint: ['点線の言葉（例：', '）をタップすると、短い説明が出ます。']};
  const pop = document.createElement('div');
  pop.className = 'gl-pop';
  pop.setAttribute('role', 'dialog');
  pop.setAttribute('aria-modal', 'false');
  pop.setAttribute('aria-labelledby', 'gl-title');
  pop.hidden = true;
  pop.innerHTML = '<div class="gl-card" tabindex="-1"><p class="gl-kicker"></p><p class="gl-title" id="gl-title"></p><p class="gl-def"></p><p class="gl-row gl-ex"><span></span><span class="gl-text"></span></p><p class="gl-row gl-site"><span></span><span class="gl-text"></span></p><button type="button" class="gl-close"><span aria-hidden="true">×</span></button></div><span class="gl-arrow" aria-hidden="true"></span>';
  document.body.append(pop);
  const card = pop.querySelector('.gl-card');
  const arrow = pop.querySelector('.gl-arrow');
  const closeButton = pop.querySelector('.gl-close');
  pop.querySelector('.gl-kicker').textContent = words.kicker;
  pop.querySelector('.gl-ex > span').textContent = words.example;
  pop.querySelector('.gl-site > span').textContent = words.site;
  closeButton.setAttribute('aria-label', words.close);

  let current = null;
  let hideTimer = null;
  const sheet = () => window.matchMedia('(max-width: 699px)').matches;
  const place = () => {
    if (!current || pop.hidden) return;
    if (sheet()) {
      pop.dataset.mode = 'sheet';
      pop.style.left = pop.style.top = '';
      return;
    }
    pop.dataset.mode = 'bubble';
    const box = current.getBoundingClientRect();
    const width = pop.offsetWidth;
    const height = pop.offsetHeight;
    const left = Math.max(12, Math.min(window.innerWidth - width - 12, box.left + box.width / 2 - width / 2));
    const below = box.bottom + 12 + height <= window.innerHeight - 8 || box.top - 12 - height < 8;
    pop.dataset.side = below ? 'below' : 'above';
    pop.style.left = `${left}px`;
    pop.style.top = `${below ? box.bottom + 12 : box.top - 12 - height}px`;
    arrow.style.left = `${Math.max(16, Math.min(width - 16, box.left + box.width / 2 - left))}px`;
    // Close if the term has scrolled out of view.
    if (box.bottom < 0 || box.top > window.innerHeight) close(false);
  };
  const fill = (selector, value) => {
    const row = pop.querySelector(selector);
    row.hidden = !value;
    if (value) row.querySelector('.gl-text').textContent = value;
  };
  const open = term => {
    const entry = entries.get(term.dataset.term);
    if (!entry) return;
    if (current) current.setAttribute('aria-expanded', 'false');
    window.clearTimeout(hideTimer);
    current = term;
    term.setAttribute('aria-expanded', 'true');
    pop.querySelector('.gl-title').textContent = entry.t;
    pop.querySelector('.gl-def').textContent = entry.d;
    fill('.gl-ex', entry.e);
    fill('.gl-site', entry.s);
    pop.hidden = false;
    pop.classList.remove('is-open');
    place();
    // Next frame: let the entrance transition start from its closed state.
    window.requestAnimationFrame(() => pop.classList.add('is-open'));
    card.focus({preventScroll: true});
  };
  const close = (returnFocus = true) => {
    if (!current) return;
    const term = current;
    current = null;
    term.setAttribute('aria-expanded', 'false');
    pop.classList.remove('is-open');
    hideTimer = window.setTimeout(() => { pop.hidden = true; }, 200);
    if (returnFocus) term.focus({preventScroll: true});
  };

  document.addEventListener('click', event => {
    const term = event.target.closest('.gl-term');
    if (term) {
      if (term === current) close();
      else open(term);
      return;
    }
    if (event.target.closest('.gl-close')) { close(); return; }
    if (current && !event.target.closest('.gl-pop')) close(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && current) close();
  });
  let placing = null;
  const schedulePlace = () => {
    if (placing === null) placing = window.requestAnimationFrame(() => { placing = null; place(); });
  };
  window.addEventListener('scroll', () => { if (current && pop.dataset.mode === 'bubble') schedulePlace(); }, {passive: true});
  window.addEventListener('resize', () => { if (current) schedulePlace(); });
  window.addEventListener('beforeprint', () => close(false));

  // One quiet hint near the top of the page, with a live example to try.
  const lead = main.querySelector('.hero-lead, .lead');
  if (lead) {
    const id = lead.matches('.hero-lead') ? 'cell-line' : 'signature';
    const hint = document.createElement('p');
    hint.className = 'gl-hint';
    hint.innerHTML = '<span class="gl-hint-mark" aria-hidden="true">?</span><span></span>';
    const sample = document.createElement('button');
    sample.type = 'button';
    sample.className = 'gl-term';
    sample.dataset.term = id;
    sample.setAttribute('aria-haspopup', 'dialog');
    const label = entries.get(id).t.replace(/（.*$/, '');
    sample.textContent = english ? label.toLowerCase() : label;
    hint.lastChild.append(words.hint[0], sample, words.hint[1]);
    lead.after(hint);
  }

  idle(() => run(collect()));
})();
