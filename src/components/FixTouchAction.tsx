import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

/**
 * Mantiene `touch-action: none` sobre el lienzo, pase lo que pase después.
 *
 * `OrbitControls` de `three-stdlib` ya pone `touch-action: none` al conectar
 * —el mismo arreglo que e7.2 creyó necesitar en CSS, y que nunca podía ganarle
 * a un estilo en línea—, pero desconecta y reconecta en algún punto después
 * del montaje —verificado con un `MutationObserver`: el momento varía
 * (217-286 ms medidos), coincide con la carga del modelo, y una única
 * reasignación tras el montaje no alcanza a ganarle: la reconexión llega
 * después. En vez de adivinar el momento exacto, se vigila el estilo del
 * lienzo mientras el componente vive y se corrige apenas cambie —sin
 * importar cuándo ni cuántas veces `OrbitControls` decida tocarlo.
 */
export function FixTouchAction() {
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    const lienzo = gl.domElement
    const fijar = () => {
      if (lienzo.style.touchAction !== 'none') lienzo.style.touchAction = 'none'
    }
    fijar()
    const observador = new MutationObserver(fijar)
    observador.observe(lienzo, { attributes: true, attributeFilter: ['style'] })
    return () => observador.disconnect()
  }, [gl])
  return null
}
