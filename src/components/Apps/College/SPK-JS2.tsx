"use client";

import { WindowLauncherProps } from "@/components/ui/Taskbar/TaskbarItem";
import { createRef, useState } from "react";

interface Criterion {
  id: string;
  name: string;
  weight: number;
  type: "benefit" | "cost";
}

interface Alternative {
  name: string;
  scores: Record<string, number>; // Contoh: { c1: 2, c2: 2, c3: 2, c4: 7, c5: 3 }
}

const CollegeSPKJS2 = () => {
  const initialCriteria: Criterion[] = [
    { id: "c1", name: "Fasilitas Pendukung", weight: 0.3, type: "benefit" },
    { id: "c2", name: "Harga per m²", weight: 0.2, type: "cost" },
    { id: "c3", name: "Tahun Konstruksi", weight: 0.2, type: "benefit" },
    {
      id: "c4",
      name: "Jarak dari Tempat Kerja, Skor",
      weight: 0.2,
      type: "cost",
    },
    { id: "c5", name: "Sistem Keamanan", weight: 0.1, type: "benefit" },
  ];

  const initialAlternatives: Alternative[] = [
    { name: "Apartemen 1", scores: { c1: 2, c2: 2, c3: 2, c4: 1, c5: 3 } },
    { name: "Apartemen 2", scores: { c1: 4, c2: 1, c3: 3, c4: 2, c5: 3 } },
    { name: "Apartemen 3", scores: { c1: 3, c2: 2, c3: 2, c4: 3, c5: 4 } },
  ];

  const initialScores: Record<string, Array<number>> = {
    c1: [1, 4],
    c2: [1, 3],
    c3: [1, 3],
    c4: [1, 3],
    c5: [1, 4],
  };

  const [scores, setScores] = useState<Record<string, number[]>>(initialScores);
  const [criteria, setCriteria] = useState<Criterion[]>(initialCriteria);
  const [alternatives, setAlternatives] =
    useState<Alternative[]>(initialAlternatives);

  const handleAlternativeScoreChange = (
    altIndex: number,
    critId: string,
    value: string
  ) => {
    const newAlternatives = [...alternatives];
    const num = parseFloat(value);
    newAlternatives[altIndex].scores[critId] = isNaN(num) ? 0 : num;
    setAlternatives(newAlternatives);
  };

  const handleCriterionWeightChange = (critId: string, value: string) => {
    const newCriteria = criteria.map((crit) =>
      crit.id === critId ? { ...crit, weight: parseFloat(value) || 0 } : crit
    );
    setCriteria(newCriteria);
  };

  const handleScoresChange = (
    critId: string,
    value: string,
    isMaxScore: boolean
  ) => {
    const newScores = { ...scores };
    const num = parseFloat(value);
    newScores[critId][isMaxScore ? 1 : 0] = isNaN(num) ? 1 : num;
    setScores(newScores);
  };

  const normalizedAlternatives = alternatives.map((alt) => {
    const normalizedScores: Record<string, number> = {};
    criteria.forEach((criterion) => {
      const scoresForCriterion = scores[criterion.id];
      if (criterion.type === "benefit") {
        const maxScore = Math.max(...scoresForCriterion);
        normalizedScores[criterion.id] =
          maxScore === 0 ? 0 : alt.scores[criterion.id] / maxScore;
      } else {
        const minScore = Math.min(...scoresForCriterion);
        normalizedScores[criterion.id] =
          alt.scores[criterion.id] === 0
            ? 0
            : minScore / alt.scores[criterion.id];
      }
    });
    return { name: alt.name, normalizedScores };
  });

  const wsmResults = normalizedAlternatives.map((alt) => {
    let score = 0;
    criteria.forEach((criterion) => {
      score += alt.normalizedScores[criterion.id] * criterion.weight;
    });
    return { name: alt.name, score };
  });

  const wpmResults = normalizedAlternatives.map((alt) => {
    let product = 1;
    criteria.forEach((criterion) => {
      product *= Math.pow(alt.normalizedScores[criterion.id], criterion.weight);
    });
    return { name: alt.name, score: product };
  });

  const bestWSM = wsmResults.reduce((prev, curr) =>
    curr.score > prev.score ? curr : prev
  );
  const bestWPM = wpmResults.reduce((prev, curr) =>
    curr.score > prev.score ? curr : prev
  );

  return (
    <div className="mx-auto p-6 bg-background text-foreground w-full h-full overflow-auto">
      <h1 className="text-3xl font-bold mb-6">
        Sistem Pendukung Keputusan - Studi Kasus Apartemen
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Input Data Kriteria</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full  border border-gray-200">
            <thead>
              <tr className="bg-primary">
                <th className="py-2 px-4 border-b">Kriteria</th>
                <th className="py-2 px-4 border-b">Tipe</th>
                <th className="py-2 px-4 border-b">Min Skor</th>
                <th className="py-2 px-4 border-b">Max Skor</th>
                <th className="py-2 px-4 border-b">Bobot (desimal)</th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((criterion) => (
                <tr key={criterion.id} className="text-center">
                  <td className="py-2 px-4 border-b">{criterion.name}</td>
                  <td className="py-2 px-4 border-b">{criterion.type}</td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="number"
                      value={scores[criterion.id][0]}
                      onChange={(e) => {
                        handleScoresChange(criterion.id, e.target.value, false);
                      }}
                      className="w-20 border rounded px-2 py-1 text-center bg-background"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="number"
                      value={scores[criterion.id][1]}
                      onChange={(e) => {
                        handleScoresChange(criterion.id, e.target.value, true);
                      }}
                      className="w-20 border rounded px-2 py-1 text-center bg-background"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">
                    <input
                      type="number"
                      step="0.01"
                      value={criterion.weight}
                      onChange={(e) =>
                        handleCriterionWeightChange(
                          criterion.id,
                          e.target.value
                        )
                      }
                      className="w-20 border rounded px-2 py-1 text-center bg-background"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Input Data Alternatif</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full  border border-gray-200">
            <thead>
              <tr className="bg-primary">
                <th className="py-2 px-4 border-b">Alternatif</th>
                {criteria.map((criterion) => (
                  <th key={criterion.id} className="py-2 px-4 border-b">
                    {criterion.name}{" "}
                    <span className="text-sm text-gray-600">
                      ({criterion.type})
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alternatives.map((alt, altIndex) => (
                <tr key={altIndex} className="text-center">
                  <td className="py-2 px-4 border-b">{alt.name}</td>
                  {criteria.map((criterion) => (
                    <td key={criterion.id} className="py-2 px-4 border-b">
                      <input
                        type="number"
                        value={alt.scores[criterion.id]}
                        onChange={(e) => {
                          const max = Math.max(...scores[criterion.id]);
                          const min = Math.min(...scores[criterion.id]);
                          if (parseFloat(e.target.value) > max) {
                            e.target.value = max.toString();
                          }
                          if (parseFloat(e.target.value) < min) {
                            e.target.value = min.toString();
                          }

                          handleAlternativeScoreChange(
                            altIndex,
                            criterion.id,
                            e.target.value
                          );
                        }}
                        className="w-20 border rounded px-2 py-1 text-center bg-background"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Hasil Perhitungan WSM</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full  border border-gray-200">
            <thead>
              <tr className="bg-primary">
                <th className="py-2 px-4 border-b">Alternatif</th>
                <th className="py-2 px-4 border-b">Skor</th>
              </tr>
            </thead>
            <tbody>
              {wsmResults.map((result, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{result.name}</td>
                  <td className="py-2 px-4 border-b">
                    {result.score.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-lg">
          <strong>Alternatif Terbaik (WSM):</strong> {bestWSM.name} dengan skor{" "}
          {bestWSM.score.toFixed(3)}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Hasil Perhitungan WPM</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full  border border-gray-200">
            <thead>
              <tr className="bg-primary">
                <th className="py-2 px-4 border-b">Alternatif</th>
                <th className="py-2 px-4 border-b">Skor</th>
              </tr>
            </thead>
            <tbody>
              {wpmResults.map((result, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{result.name}</td>
                  <td className="py-2 px-4 border-b">
                    {result.score.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-lg">
          <strong>Alternatif Terbaik (WPM):</strong> {bestWPM.name} dengan skor{" "}
          {bestWPM.score.toFixed(3)}
        </p>
      </section>
    </div>
  );
};

export const collegeLauncherSPKJS2: WindowLauncherProps = {
  title: `College-SPK JS2`,
  appId: "college-spk-js2",
  content: <CollegeSPKJS2 />,
  size: {
    width: 800,
    height: 500,
  },
  launcherRef: createRef(),
};
