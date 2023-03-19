/**
 * Returns storage with the most updated items
 *
 * e.g:
 *
 * sessionStorage.setItem('age', 32)
 *
 * then
 *
 * const storage = useSessionStorage()
 * console.log(storage?.age); // 32
 * @returns
 */
declare const useSessionStorage: () => any;
export default useSessionStorage;
