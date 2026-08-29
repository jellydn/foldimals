import type { AnimalLesson, FoldGuide, Point } from '../types'

const point = (x: number, y: number): Point => ({ x, y })
const guide = (
  line: [number, number, number, number],
  arrow: [number, number, number, number],
  targets: Point[] = [],
): FoldGuide => ({
  line: [point(line[0], line[1]), point(line[2], line[3])],
  arrow: [point(arrow[0], arrow[1]), point(arrow[2], arrow[3])],
  targets,
})

export const lessons: AnimalLesson[] = [
  {
    id: 'dog',
    name: 'Dog',
    tagline: 'A floppy-eared friend',
    difficulty: 'Easy',
    minutes: 5,
    color: '#ff876d',
    paperColor: '#ffc86b',
    steps: [
      { id: 'dog-1', instruction: 'Turn your square like a diamond.', hint: 'Point one corner toward your tummy.', diagram: 'diamond', guide: guide([55, 55, 245, 245], [95, 82, 205, 205], [point(55, 55), point(245, 245)]) },
      { id: 'dog-2', instruction: 'Fold the top corner down to the bottom.', hint: 'Make the two pointy corners kiss.', diagram: 'triangle-down', guide: guide([55, 150, 245, 150], [150, 65, 150, 220], [point(150, 55), point(150, 245)]) },
      { id: 'dog-3', instruction: 'Fold the left corner down for an ear.', hint: 'Aim the point just outside the bottom edge.', diagram: 'dog-ear-left', guide: guide([104, 105, 104, 185], [82, 122, 68, 205], [point(75, 150)]) },
      { id: 'dog-4', instruction: 'Fold the right corner down to match.', hint: 'Make both ears hang the same amount.', diagram: 'dog-ears', guide: guide([196, 105, 196, 185], [218, 122, 232, 205], [point(225, 150)]) },
      { id: 'dog-5', instruction: 'Fold the bottom tip up for a snout.', hint: 'A small fold makes a little nose.', diagram: 'dog-snout', guide: guide([120, 205, 180, 205], [150, 236, 150, 190], [point(150, 230)]) },
      { id: 'dog-6', instruction: 'Flip it over. Your dog is ready!', hint: 'Turn the whole model over like a pancake.', diagram: 'dog-final', guide: guide([95, 150, 205, 150], [110, 150, 210, 150]) },
    ],
  },
  {
    id: 'cat',
    name: 'Cat',
    tagline: 'A bright, pointy-eared pal',
    difficulty: 'Easy',
    minutes: 5,
    color: '#8f7ee7',
    paperColor: '#b8a7ff',
    steps: [
      { id: 'cat-1', instruction: 'Turn your square like a diamond.', hint: 'One point should face you.', diagram: 'diamond', guide: guide([55, 55, 245, 245], [92, 80, 204, 205], [point(55, 55), point(245, 245)]) },
      { id: 'cat-2', instruction: 'Fold the bottom corner up to the top.', hint: 'Line up the points, then press the crease.', diagram: 'triangle-up', guide: guide([55, 150, 245, 150], [150, 235, 150, 75], [point(150, 245), point(150, 55)]) },
      { id: 'cat-3', instruction: 'Fold the left corner up for an ear.', hint: 'Let the point peek above the long edge.', diagram: 'cat-ear-left', guide: guide([104, 115, 104, 190], [80, 164, 90, 82], [point(75, 150)]) },
      { id: 'cat-4', instruction: 'Fold the right corner up to match.', hint: 'Check that the ears are twins.', diagram: 'cat-ears', guide: guide([196, 115, 196, 190], [220, 164, 210, 82], [point(225, 150)]) },
      { id: 'cat-5', instruction: 'Fold the top tip down a little.', hint: 'This makes the cat’s head less pointy.', diagram: 'cat-head', guide: guide([125, 92, 175, 92], [150, 62, 150, 108], [point(150, 68)]) },
      { id: 'cat-6', instruction: 'Flip it over. Hello, kitty!', hint: 'Turn the whole shape over carefully.', diagram: 'cat-final', guide: guide([95, 150, 205, 150], [110, 150, 210, 150]) },
    ],
  },
  {
    id: 'mouse',
    name: 'Mouse',
    tagline: 'Tiny ears, big personality',
    difficulty: 'Easy',
    minutes: 7,
    color: '#4ea99b',
    paperColor: '#80d3c2',
    steps: [
      { id: 'mouse-1', instruction: 'Turn the square like a diamond.', hint: 'Put a point at the top and bottom.', diagram: 'diamond', guide: guide([55, 55, 245, 245], [90, 84, 207, 207]) },
      { id: 'mouse-2', instruction: 'Fold the left corner to the right.', hint: 'Match the side points exactly.', diagram: 'triangle-side', guide: guide([150, 55, 150, 245], [68, 150, 226, 150], [point(55, 150), point(245, 150)]) },
      { id: 'mouse-3', instruction: 'Fold the top edge toward the middle.', hint: 'Stop when it meets the center crease.', diagram: 'mouse-kite-top', guide: guide([150, 70, 150, 150], [195, 80, 154, 135]) },
      { id: 'mouse-4', instruction: 'Fold the bottom edge toward the middle.', hint: 'Now your shape looks like a skinny kite.', diagram: 'mouse-kite', guide: guide([150, 150, 150, 230], [195, 220, 154, 165]) },
      { id: 'mouse-5', instruction: 'Fold the wide corner back for an ear.', hint: 'Leave a round-looking triangle showing.', diagram: 'mouse-ear', guide: guide([185, 112, 185, 188], [218, 150, 178, 150], [point(230, 150)]) },
      { id: 'mouse-6', instruction: 'Fold the nose tip back a tiny bit.', hint: 'Only fold the very end of the point.', diagram: 'mouse-nose', guide: guide([78, 135, 78, 165], [55, 150, 88, 150], [point(55, 150)]) },
      { id: 'mouse-7', instruction: 'Flip it over. Squeak, squeak!', hint: 'Turn it over and point the nose left.', diagram: 'mouse-final', guide: guide([110, 110, 195, 195], [118, 125, 198, 205]) },
    ],
  },
  {
    id: 'frog',
    name: 'Frog',
    tagline: 'A cheerful pond jumper',
    difficulty: 'Medium',
    minutes: 8,
    color: '#72a83d',
    paperColor: '#a8d85e',
    steps: [
      { id: 'frog-1', instruction: 'Fold the square in half sideways.', hint: 'Bring the left edge onto the right edge.', diagram: 'rectangle', guide: guide([150, 55, 150, 245], [65, 150, 230, 150]) },
      { id: 'frog-2', instruction: 'Open it, then fold in half top to bottom.', hint: 'Make a crease that crosses the first one.', diagram: 'square-cross', guide: guide([55, 150, 245, 150], [150, 65, 150, 235]) },
      { id: 'frog-3', instruction: 'Fold both top corners into the center.', hint: 'The corners meet on the middle line.', diagram: 'frog-roof', guide: guide([55, 105, 245, 105], [70, 70, 145, 145], [point(55, 55), point(245, 55)]) },
      { id: 'frog-4', instruction: 'Squash the top into a triangle.', hint: 'Push the sides inward while the top comes down.', diagram: 'frog-triangle', guide: guide([55, 150, 245, 150], [150, 72, 150, 148]) },
      { id: 'frog-5', instruction: 'Fold the bottom edge up to the triangle.', hint: 'The bottom edge touches the triangle’s base.', diagram: 'frog-body', guide: guide([55, 200, 245, 200], [150, 240, 150, 182]) },
      { id: 'frog-6', instruction: 'Fold the left side in to the middle.', hint: 'Keep the pointy head free.', diagram: 'frog-side-left', guide: guide([105, 145, 105, 220], [62, 184, 120, 184]) },
      { id: 'frog-7', instruction: 'Fold the right side in to match.', hint: 'Make a neat skinny rectangle below the head.', diagram: 'frog-sides', guide: guide([195, 145, 195, 220], [238, 184, 180, 184]) },
      { id: 'frog-8', instruction: 'Zigzag the bottom to make springy legs.', hint: 'Fold up, then a little bit back down.', diagram: 'frog-final', guide: guide([105, 202, 195, 202], [150, 230, 150, 190], [point(110, 225), point(190, 225)]) },
    ],
  },
  {
    id: 'bird',
    name: 'Bird',
    tagline: 'A little friend ready to fly',
    difficulty: 'Medium',
    minutes: 10,
    color: '#3988d3',
    paperColor: '#79b9ed',
    steps: [
      { id: 'bird-1', instruction: 'Turn the square like a diamond.', hint: 'One point faces the sky.', diagram: 'diamond', guide: guide([55, 55, 245, 245], [90, 82, 205, 205]) },
      { id: 'bird-2', instruction: 'Fold the left corner to the right.', hint: 'Match the side points and crease.', diagram: 'triangle-side', guide: guide([150, 55, 150, 245], [65, 150, 230, 150]) },
      { id: 'bird-3', instruction: 'Open it. Fold both sides to the middle.', hint: 'Make a long kite with a pointy top.', diagram: 'bird-kite', guide: guide([150, 55, 150, 245], [70, 125, 145, 150], [point(55, 150), point(245, 150)]) },
      { id: 'bird-4', instruction: 'Fold the bottom point up to the top.', hint: 'The long kite folds in half.', diagram: 'bird-diamond', guide: guide([70, 150, 230, 150], [150, 238, 150, 68]) },
      { id: 'bird-5', instruction: 'Fold the top flap down for a wing.', hint: 'Angle it so the wing points backward.', diagram: 'bird-wing-one', guide: guide([105, 110, 195, 190], [158, 105, 110, 198]) },
      { id: 'bird-6', instruction: 'Flip over and fold the other wing.', hint: 'Match the first wing on the other side.', diagram: 'bird-wings', guide: guide([105, 190, 195, 110], [142, 105, 190, 198]) },
      { id: 'bird-7', instruction: 'Fold the sharp tip down for a head.', hint: 'Bend only the top quarter forward.', diagram: 'bird-head', guide: guide([185, 92, 215, 118], [225, 75, 192, 112], [point(225, 75)]) },
      { id: 'bird-8', instruction: 'Tuck the tip inward for a beak.', hint: 'Open the head slightly and push the tip inside.', diagram: 'bird-beak', guide: guide([198, 105, 218, 125], [226, 104, 207, 122]) },
      { id: 'bird-9', instruction: 'Lift both wings. Your bird can fly!', hint: 'Gently pull the wings apart and stand it up.', diagram: 'bird-final', guide: guide([105, 145, 195, 145], [150, 175, 150, 105], [point(100, 165), point(195, 165)]) },
    ],
  },
]

export const getLesson = (id: string) => lessons.find((lesson) => lesson.id === id)

export const isLessonUnlocked = (index: number, completed: string[]) =>
  index === 0 || completed.includes(lessons[index - 1].id)
