export const quickSort = (array: number[]): number[] => {
  if (array.length <= 1) {
    return array
  }
  const left: number[] = []
  const right: number[] = []

  const lnt = array.length - 1
  const pivot = array[lnt] as number

  for (let i = 0; i < lnt; i++) {
    if ((array[i] as number) < pivot) {
      left.push(array[i] as number)
    } else {
      right.push(array[i] as number)
    }
  }
  // selected pivot put itself always between left[] and right[] items
  // (see return array middle element).
  // The return statement asks for sorting both the left and the right
  // so they will insert their own lefts and rights to the left and right
  // of their pivots -- which come to the left and rights of the initial
  // pivot in the return array
  // so number of pivots will increase in number while left and right
  // arrays are shrinking to an empty arrays where the recurrence ends
  return [...quickSort(left), pivot, ...quickSort(right)]
}

/*
  const arr = [22,1,23,48,87,61,87,64,87,64]
  console.log(arr)
  [LOG]: [22, 1, 23, 48, 87, 61, 87, 64, 87, 64] 
  console.log(quickSort(arr))
  [LOG]: [1, 22, 23, 48, 61, 64, 64, 87, 87, 87]
*/

export const bubbleSort = (array: number[]): number[] => {
  for (let n = array.length; n >= 0; n--) {
    for (let i = 0; i < n - 1; i++) {
      if ((array[i] as number) > (array[i + 1] as number)) {
        // swap elements
        // @ts-ignore
        [(array[i]), array[i + 1]] = [array[i + 1], array[i]]
      }
    }
  }
  return array
}
/*
  console.log(bubbleSort(arr))
  [LOG]: [1, 22, 23, 48, 61, 64, 64, 87, 87, 87]
*/

export const insertionSort = (array: number[]): number[] => {
  const lnt = array.length
  for (let i = 1; i < array.length; i++) {
    const val = array[i] as number
    let j = i - 1
    for (j; j >= 0; j--) {
      if ((array[j] as number) > val) {
        // @ts-ignore
        array[j + 1] = array[j]
      } else {
        break
      }
    }
    array[j + 1] = val
  }
  return array
}
/*
  console.log(insertionSort(arr))
  [1, 22, 23, 48, 61, 64, 64, 87, 87, 87]
*/

export const selectionSort = (array: number[]) => {
  const lnt = array.length
  for (let i = 0; i < lnt - 1; i++) {
    let minIx = i
    for (let j = i + 1; j < lnt; j++) {
      if ((array[j] as number) < (array[minIx] as number)) {
        minIx = j
      }
    }
    if (minIx !== i) {
      // swap elements
      // @ts-ignore
      [array[i], array[minIx]] = [array[minIx], array[i]]
    }
  }
  return array
}

/*
    console.log(selectionSort(arr))
    [1, 22, 23, 48, 61, 64, 64, 87, 87, 87]
*/