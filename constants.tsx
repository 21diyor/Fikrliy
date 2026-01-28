
import React from 'react';
import { Course, Level, Question } from './types';
import { DragDropCollector, BalanceScale, GridBuilder, TransformGrid } from './components/Illustrations';
import GeometryBoard from './components/GeometryBoard';

// --- ARITHMETIC: 10 VISUAL EXERCISES ---
const createArithmeticLevels = (): Level[] => [
  {
    id: 'ari-l1',
    title: "Somsalar Soni",
    steps: [{
      id: 's1', type: 'explore', questions: [{
        id: 'q1', type: 'drag-drop', prompt: "Mijozga 3 ta somsa bering.",
        explanation: "1 + 1 + 1 = 3. Siz miqdorlarni sanashni boshladingiz!",
        interactive: ({ onDiscover }) => <DragDropCollector target={3} itemEmoji="🥟" containerLabel="Likopcha" onDiscover={(v) => onDiscover(v === 3)} />
      }]
    }]
  },
  {
    id: 'ari-l2',
    title: "Choynak va Piyola",
    steps: [{
      id: 's2', type: 'explore', questions: [{
        id: 'q1', type: 'multiple-choice', prompt: "1 ta choynak 2 ta piyolani to'ldiradi.",
        subPrompt: "4 ta piyola uchun nechta choynak kerak?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2",
        explanation: "Har bir choynak 2 tadan piyolani to'ldiradi: 2 + 2 = 4."
      }]
    }]
  },
  {
    id: 'ari-l3',
    title: "Savatda Olmalar",
    steps: [{
      id: 's3', type: 'explore', questions: [{
        id: 'q1', type: 'grid-builder', prompt: "3 qator va 4 ustun qilib olma joylang.",
        explanation: "3 x 4 = 12. Ko'paytirish - bu teng qatorlarni qo'shishdir.",
        interactive: ({ onDiscover }) => <GridBuilder rows={3} cols={4} onDiscover={(c) => onDiscover(c === 12)} />
      }]
    }]
  },
  {
    id: 'ari-l4',
    title: "Adolatli Taqsimot",
    steps: [{
      id: 's4', type: 'explore', questions: [{
        id: 'q1', type: 'drag-drop', prompt: "12 ta somsani 3 kishiga teng bo'ling.",
        subPrompt: "Har biriga nechta tushadi?",
        explanation: "12 / 3 = 4. Har bir kishi 4 tadan somsa oladi.",
        interactive: ({ onDiscover }) => <DragDropCollector target={4} itemEmoji="🥟" containerLabel="Bir kishi uchun" onDiscover={(v) => onDiscover(v === 4)} />
      }]
    }]
  },
  {
    id: 'ari-l5',
    title: "Bozor Pullari",
    steps: [{
      id: 's5', type: 'explore', questions: [{
        id: 'q1', type: 'multiple-choice', prompt: "Hamyoningizda 20 so'm bor. Bir kilo somsa 4 so'm.",
        subPrompt: "Necha kilo somsa olishingiz mumkin?",
        options: ["4", "5", "6", "8"],
        correctAnswer: "5",
        explanation: "20 ni 4 ga bo'lsak, 5 hosil bo'ladi. 5 x 4 = 20."
      }]
    }]
  },
  {
    id: 'ari-l6',
    title: "Non Bo'laklari",
    steps: [{
      id: 's6', type: 'explore', questions: [{
        id: 'q1', type: 'multiple-choice', prompt: "8 bo'lakli nondan 3 bo'lagini yedingiz.",
        subPrompt: "Necha bo'lak qoldi?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "5",
        explanation: "8 - 3 = 5. Ayirish - bu mavjud narsadan olib tashlashdir."
      }]
    }]
  },
  {
    id: 'ari-l7',
    title: "Piyola Yarmi",
    steps: [{
      id: 's7', type: 'explore', questions: [{
        id: 'q1', type: 'multiple-choice', prompt: "Har bir piyola 0.5 litr (yarim litr).",
        subPrompt: "3 ta piyolada jami qancha choy bor?",
        options: ["1.0 litr", "1.5 litr", "2.0 litr", "2.5 litr"],
        correctAnswer: "1.5 litr",
        explanation: "0.5 + 0.5 + 0.5 = 1.5. Kasrlar - butunning qismlaridir."
      }]
    }]
  },
  {
    id: 'ari-l8',
    title: "O'suvchi Qator",
    steps: [{
      id: 's8', type: 'explore', questions: [{
        id: 'q1', type: 'multiple-choice', prompt: "Qonuniyatni toping: 2, 5, 8, 11, ...",
        subPrompt: "Keyingi son qaysi?",
        options: ["12", "13", "14", "15"],
        correctAnswer: "14",
        explanation: "Har safar 3 tadan qo'shilyapti. 11 + 3 = 14."
      }]
    }]
  },
  {
    id: 'ari-l9',
    title: "Savat va Mevalar",
    steps: [{
      id: 's9', type: 'explore', questions: [{
        id: 'q1', type: 'grid-builder', prompt: "2 ta 5 talik paket va 3 dona olma (2x5 + 3).",
        subPrompt: "Jami nechta olma bo'ladi?",
        explanation: "2 x 5 = 10, va yana 3 qo'shsak 13 bo'ladi.",
        interactive: ({ onDiscover }) => <GridBuilder rows={2} cols={7} onDiscover={(c) => onDiscover(c === 13)} />
      }]
    }]
  },
  {
    id: 'ari-l10',
    title: "Tezkor Hisob",
    steps: [{
      id: 's10', type: 'quiz', questions: [{
        id: 'q1', type: 'multiple-choice', prompt: "6 ni 2 ga bo'lib, 7 ni qo'shing.",
        options: ["9", "10", "11", "12"],
        correctAnswer: "10",
        explanation: "6 / 2 = 3. 3 + 7 = 10. Siz arifmetika ustasisiz!"
      }]
    }]
  }
];

// --- ALGEBRA: 10 VISUAL EXERCISES ---
const createAlgebraLevels = (): Level[] => [
  {
    id: 'alg-l1',
    title: "Sirli Quti (x + 2 = 5)",
    steps: [{
      id: 's1', type: 'explore', questions: [{
        id: 'q1', type: 'balance', prompt: "Tarozi muvozanatda bo'lishi uchun qutida nechta olma bor?",
        subPrompt: "Chapda: 1 quti + 2 olma. O'ngda: 5 olma.",
        explanation: "x + 2 = 5 bo'lsa, x = 3 bo'ladi. Algebra - bu noma'lumni topish.",
        interactive: ({ onDiscover }) => <BalanceScale leftWeight={5} rightInitial={2} onDiscover={(v) => onDiscover(v === 5)} />
      }]
    }]
  },
  {
    id: 'alg-l2',
    title: "Ikkita Quti (2x = 10)",
    steps: [{
      id: 's2', type: 'explore', questions: [{
        id: 'q1', type: 'balance', prompt: "Ikki quti 10 ta tangaga teng.",
        subPrompt: "Bitta qutida nechta tanga bor?",
        explanation: "2x = 10 bo'lsa, bitta x = 5 bo'ladi. Bo'lish orqali tenglikni saqlaymiz.",
        interactive: ({ onDiscover }) => <BalanceScale leftWeight={10} rightInitial={0} onDiscover={(v) => onDiscover(v === 10)} />
      }]
    }]
  },
  {
    id: 'alg-l3',
    title: "Murakkabroq Tenglama",
    steps: [{
      id: 's3', type: 'explore', questions: [{
        id: 'q1', type: 'multiple-choice', prompt: "2 ta quti va 1 ta tanga jami 7 ga teng.",
        subPrompt: "Bitta qutida nechta tanga bor?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "3",
        explanation: "2x + 1 = 7. Avval 1 ni ayiramiz: 2x = 6. Keyin 2 ga bo'lamiz: x = 3."
      }]
    }]
  },
  {
    id: 'alg-l4',
    title: "O'suvchi Naqsh",
    steps: [{
      id: 's4', type: 'explore', questions: [{
        id: 'q1', type: 'multiple-choice', prompt: "Naqsh har qadamda 2 tadan ko'paymoqda.",
        subPrompt: "10-qadamda nechta koshin bo'ladi?",
        options: ["10", "15", "20", "25"],
        correctAnswer: "20",
        explanation: "Qoida: y = 2x. 10-chi qadamda 2 x 10 = 20."
      }]
    }]
  },
  {
    id: 'alg-l5',
    title: "Savat Tenglamasi",
    steps: [{
      id: 's5', type: 'explore', questions: [{
        id: 'q1', type: 'multiple-choice', prompt: "3 ta savat va 3 ta olma jami 15 bo'lsa,",
        subPrompt: "Bitta savatda nechta olma bor?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
        explanation: "3x + 3 = 15 => 3x = 12 => x = 4."
      }]
    }]
  },
  {
    id: 'alg-l6',
    title: "Perimetr x i",
    steps: [{
      id: 's6', type: 'explore', questions: [{
        id: 'q1', type: 'multiple-choice', prompt: "To'rtburchak tomonlari 'x' va 5 ga teng.",
        subPrompt: "Perimetr 20 bo'lsa, x nechaga teng?",
        options: ["4", "5", "6", "10"],
        correctAnswer: "5",
        explanation: "2 * (x + 5) = 20 => x + 5 = 10 => x = 5."
      }]
    }]
  },
  {
    id: 'alg-l7',
    title: "Kvadrat Maydoni",
    steps: [{
      id: 's7', type: 'explore', questions: [{
        id: 'q1', type: 'grid-builder', prompt: "Tomoni x bo'lgan kvadrat qurilmoqda.",
        subPrompt: "Agar x = 4 bo'lsa, maydon (x²) necha bo'ladi?",
        explanation: "4 x 4 = 16. Kvadratning maydoni uning tomoni darajasidir.",
        interactive: ({ onDiscover }) => <GridBuilder rows={4} cols={4} onDiscover={(c) => onDiscover(c === 16)} />
      }]
    }]
  },
  {
    id: 'alg-l8',
    title: "Ildizni Topish",
    steps: [{
      id: 's8', type: 'explore', questions: [{
        id: 'q1', type: 'multiple-choice', prompt: "Kvadrat maydoni 25 ga teng bo'lsa,",
        subPrompt: "Uning tomoni 'x' nechaga teng?",
        options: ["3", "4", "5", "6"],
        correctAnswer: "5",
        explanation: "x² = 25 bo'lsa, x = 5. Chunki 5 * 5 = 25."
      }]
    }]
  },
  {
    id: 'alg-l9',
    title: "Algebraik Naqsh",
    steps: [{
      id: 's9', type: 'explore', questions: [{
        id: 'q1', type: 'multiple-choice', prompt: "Tomoni (x + 2) bo'lgan kvadratning maydoni nima?",
        subPrompt: "Agar x = 1 bo'lsa.",
        options: ["4", "9", "16", "25"],
        correctAnswer: "9",
        explanation: "(1 + 2)² = 3² = 9. Siz algebraik ifodalarni tushunyapsiz!"
      }]
    }]
  },
  {
    id: 'alg-l10',
    title: "Kvadrat Tenglama",
    steps: [{
      id: 's10', type: 'quiz', questions: [{
        id: 'q1', type: 'multiple-choice', prompt: "x * (x + 3) = 18 bo'lishi uchun,",
        subPrompt: "x qaysi songa teng bo'lishi kerak?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "3",
        explanation: "3 * (3 + 3) = 3 * 6 = 18. Tabriklaymiz, algebra ustasisiz!"
      }]
    }]
  }
];

// --- GEOMETRY: 10 HIGH-QUALITY VISUAL EXERCISES ---
const createGeometryLevels = (): Level[] => [
  {
    id: 'geo-l1',
    title: "Simmetriya Ko'zgusi",
    steps: [{
      id: 's1', type: 'explore', questions: [{
        id: 'q1', type: 'transform', prompt: "Naqshni o'ng tomonga akslantiring.",
        subPrompt: "Ko'zgu chizig'iga e'tibor bering.",
        explanation: "Simmetriya - bu ob'ektning ko'zgu aksiga teng bo'lishidir.",
        interactive: (props) => (
          <GeometryBoard 
            {...props}
            template="mirror" 
            config={{ gridSize: 6, sourcePoints: [{x:0, y:1}, {x:1, y:2}, {x:2, y:1}] }} 
          />
        )
      }]
    }]
  },
  {
    id: 'geo-l2',
    title: "Simmetrik Burish",
    steps: [{
      id: 's2', type: 'explore', questions: [{
        id: 'q1', 
        type: 'multiple-choice', 
        prompt: "Shaklni 180 darajaga buring.",
        subPrompt: "U o'z holatiga qaytadimi?",
        options: ["Ha", "Yo'q"],
        correctAnswer: "Ha",
        explanation: "Ayrim shakllar (masalan, kvadrat) 180 gradusga burilganda ham o'z ko'rinishini to'liq saqlaydi. Bu burish simmetriyasi deyiladi.",
        interactive: (props) => (
          <GeometryBoard 
            {...props}
            template="rotate" 
            config={{ targetRotation: 180 }} 
          />
        )
      }]
    }]
  },
  {
    id: 'geo-l3',
    title: "Moslashtirish (Drag)",
    steps: [{
      id: 's3', type: 'explore', questions: [{
        id: 'q1', type: 'transform', prompt: "Shaklni soya ustiga suring.",
        explanation: "Parallel ko'chirish - bu shaklni o'zgartirmasdan surishdir.",
        interactive: (props) => (
          <GeometryBoard 
            {...props}
            template="match" 
            config={{ gridSize: 8, targetOffset: {x: 2, y: -2} }} 
          />
        )
      }]
    }]
  },
  {
    id: 'geo-l4',
    title: "Perimetr Quruvchi",
    steps: [{
      id: 's4', type: 'explore', questions: [{
        id: 'q1', type: 'transform', prompt: "Perimetri 12 ga teng bo'lgan shakl quring.",
        subPrompt: "Katlarni bitta-bitta tanlang.",
        explanation: "Perimetr - shakl atrofidagi barcha tomonlar yig'indisi.",
        interactive: (props) => (
          <GeometryBoard 
            {...props}
            template="build" 
            config={{ gridSize: 8, targetPerimeter: 12 }} 
          />
        )
      }]
    }]
  },
  {
    id: 'geo-l5',
    title: "Yuza (Maydon) Sirlari",
    steps: [{
      id: 's5', type: 'explore', questions: [{
        id: 'q1', type: 'transform', prompt: "Yuzasi 9 ga teng bo'lgan kvadrat quring.",
        explanation: "Yuza - shakl ichidagi birlik kvadratlar sonidir.",
        interactive: (props) => (
          <GeometryBoard 
            {...props}
            template="build" 
            config={{ gridSize: 8, targetArea: 9 }} 
          />
        )
      }]
    }]
  },
  {
    id: 'geo-l6',
    title: "To'g'ri Burchak",
    steps: [{
      id: 's6', type: 'explore', questions: [{
        id: 'q1', type: 'multiple-choice', prompt: "Shaklni 90 gradusga buring.",
        subPrompt: "Bunday burchak qanday ataladi?",
        options: ["O'tkir", "To'g'ri", "O'tmas", "Yoyiq"],
        correctAnswer: "To'g'ri",
        explanation: "90 daraja - bu to'g'ri burchakdir.",
        interactive: (props) => (
          <GeometryBoard 
            {...props}
            template="rotate" 
            config={{ targetRotation: 90 }} 
          />
        )
      }]
    }]
  },
  {
    id: 'geo-l7',
    title: "Uchburchak Simmetriyasi",
    steps: [{
      id: 's7', type: 'explore', questions: [{
        id: 'q1', type: 'transform', prompt: "Uchburchakning o'ng yarmini yakunlang.",
        explanation: "Teng yonli uchburchak bitta simmetriya o'qiga ega.",
        interactive: (props) => (
          <GeometryBoard 
            {...props}
            template="mirror" 
            config={{ gridSize: 6, sourcePoints: [{x:2, y:0}, {x:1, y:2}, {x:2, y:4}] }} 
          />
        )
      }]
    }]
  },
  {
    id: 'geo-l8',
    title: "Shaklni Ko'chirish",
    steps: [{
      id: 's8', type: 'explore', questions: [{
        id: 'q1', type: 'transform', prompt: "Shaklni pastki burchakka suring.",
        explanation: "Geometrik shakl ko'chirilganda uning yuzasi o'zgarmaydi.",
        interactive: (props) => (
          <GeometryBoard 
            {...props}
            template="match" 
            config={{ gridSize: 8, targetOffset: {x: 3, y: 3} }} 
          />
        )
      }]
    }]
  },
  {
    id: 'geo-l9',
    title: "Murakkab Perimetr",
    steps: [{
      id: 's9', type: 'explore', questions: [{
        id: 'q1', type: 'transform', prompt: "Perimetri 10 ga teng bo'lgan shakl quring.",
        explanation: "Shakl murakkab bo'lsa ham, uning chegarasini hisoblaymiz.",
        interactive: (props) => (
          <GeometryBoard 
            {...props}
            template="build" 
            config={{ gridSize: 8, targetPerimeter: 10 }} 
          />
        )
      }]
    }]
  },
  {
    id: 'geo-l10',
    title: "Naqsh Yakuni",
    steps: [{
      id: 's10', type: 'quiz', questions: [{
        id: 'q1', type: 'transform', prompt: "Simmetrik naqshni to'liq qiling.",
        explanation: "Tabiat va arxitektura simmetriyaga asoslangan.",
        interactive: (props) => (
          <GeometryBoard 
            {...props}
            template="mirror" 
            config={{ gridSize: 6, sourcePoints: [{x:0, y:0}, {x:2, y:2}, {x:0, y:5}] }} 
          />
        )
      }]
    }]
  }
];

export const COURSES: Course[] = [
  {
    id: 'arithmetic',
    title: 'Arifmetika',
    description: "Hisob-kitobni kashf eting.",
    icon: '🧮',
    worlds: [{
      id: 'math-foundation',
      title: "Asoslar",
      icon: '🥟',
      modules: [{
        id: 'ari-mod-1',
        title: "Counting",
        levels: createArithmeticLevels()
      }]
    }]
  },
  {
    id: 'algebra',
    title: 'Algebra',
    description: "Sirli qutilar va mantiq.",
    icon: '🔢',
    worlds: [{
      id: 'algebra-logic',
      title: "Mantiq Dunyosi",
      icon: '📦',
      modules: [{
        id: 'alg-mod-1',
        title: "Equation",
        levels: createAlgebraLevels()
      }]
    }]
  },
  {
    id: 'geometry',
    title: 'Geometriya',
    description: "Naqshlar va fazoni tushuning.",
    icon: '📐',
    worlds: [{
      id: 'geometry-space',
      title: "Fazo Olami",
      icon: '🎨',
      modules: [{
        id: 'geo-mod-1',
        title: "Shapes",
        levels: createGeometryLevels()
      }]
    }]
  },
  {
    id: 'cs',
    title: 'Dasturlash',
    description: 'Algoritmlar siri.',
    icon: '🤖',
    isComingSoon: true,
    worlds: []
  }
];
