export interface PhaseExercise {
  name: string
  duration: number // seconds
  desc: string
}

export const WARMUP: Record<string, PhaseExercise[]> = {
  day_a: [
    { name: 'Кругові рухи руками', duration: 30, desc: 'По 15 вперед і назад' },
    { name: 'Присідання без ваги', duration: 40, desc: '15 повільних повторів (розминка ніг)' },
    { name: 'Відтискання від стіни', duration: 30, desc: '10-15 повільних повторів' },
    { name: 'Band pull-apart', duration: 30, desc: '15-20 повторів з гумкою (або без)' },
  ],
  day_b: [
    { name: 'Кругові рухи плечами', duration: 30, desc: 'По 15 вперед і назад' },
    { name: 'Cat-cow', duration: 40, desc: '10 повільних повторів' },
    { name: 'Band pull-apart', duration: 30, desc: '15-20 повторів' },
    { name: 'Випади на місці', duration: 30, desc: '8 на кожну ногу' },
  ],
  push: [
    { name: 'Кругові рухи руками', duration: 30, desc: 'По 15 вперед і назад' },
    { name: 'Відтискання від стіни', duration: 40, desc: '10-15 повільних повторів' },
    { name: 'Розтяжка грудей в дверях', duration: 30, desc: 'Руки на рамі, крок вперед' },
    { name: 'Band pull-apart', duration: 30, desc: '15-20 повторів з гумкою (або без)' },
  ],
  pull: [
    { name: 'Кругові рухи плечами', duration: 30, desc: 'По 15 вперед і назад' },
    { name: 'Cat-cow', duration: 40, desc: '10 повільних повторів' },
    { name: 'Band pull-apart', duration: 30, desc: '15-20 повторів' },
    { name: 'Dead hang', duration: 30, desc: 'Повиси на турніку 20-30с' },
  ],
  legs: [
    { name: 'Присідання без ваги', duration: 40, desc: '15 повільних повторів' },
    { name: 'Випади на місці', duration: 40, desc: '10 на кожну ногу' },
    { name: 'Свінги ніг', duration: 30, desc: '15 вперед-назад на кожну' },
    { name: 'Ankle circles', duration: 20, desc: '10 в кожну сторону' },
  ],
}

export const COOLDOWN: Record<string, PhaseExercise[]> = {
  day_a: [
    { name: 'Розтяжка квадрицепсу', duration: 30, desc: 'Стоячи, тягни пʼятку до сідниці' },
    { name: 'Розтяжка грудей', duration: 30, desc: 'Рука на стіні, поворот корпусу' },
    { name: 'Розтяжка спини', duration: 30, desc: 'Округли спину, тримай 30с' },
    { name: 'Розтяжка плечей', duration: 30, desc: 'Рука перед грудьми, притисни' },
  ],
  day_b: [
    { name: 'Розтяжка біцепсу стегна', duration: 30, desc: 'Нога на лаві, нахил вперед' },
    { name: 'Розтяжка спини (childʼs pose)', duration: 40, desc: 'Коліна на підлозі, руки вперед' },
    { name: 'Розтяжка грудей', duration: 30, desc: 'Рука на стіні, поворот корпусу' },
    { name: 'Розтяжка трицепсу', duration: 30, desc: 'Рука за голову, тисни ліктем' },
  ],
  push: [
    { name: 'Розтяжка грудей', duration: 30, desc: 'Рука на стіні, поворот корпусу. Кожна сторона.' },
    { name: 'Розтяжка трицепсу', duration: 30, desc: 'Рука за голову, тисни ліктем вниз' },
    { name: 'Розтяжка плечей', duration: 30, desc: 'Рука перед грудьми, притисни іншою' },
  ],
  pull: [
    { name: 'Cat stretch', duration: 30, desc: 'На колінах, округли спину максимально' },
    { name: 'Розтяжка біцепсу', duration: 30, desc: 'Рука на стіні долонею назад, поворот від неї' },
    { name: 'Child\'s pose', duration: 40, desc: 'Коліна на підлозі, руки вперед, лоб до підлоги' },
  ],
  legs: [
    { name: 'Розтяжка квадрицепсу', duration: 30, desc: 'Стоячи, тягни пʼятку до сідниці' },
    { name: 'Розтяжка біцепсу стегна', duration: 30, desc: 'Нога на лаві, нахил вперед' },
    { name: 'Розтяжка литок', duration: 30, desc: 'Упрись в стіну, пряма нога позаду' },
    { name: 'Pigeon pose', duration: 40, desc: 'Голубина поза на підлозі — розтяжка стегон' },
  ],
}
