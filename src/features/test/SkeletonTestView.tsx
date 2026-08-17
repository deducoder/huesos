import { SkeletonScene } from '../../components/SkeletonScene'
import { catalog } from '../../data/catalog'
import { progressStore } from '../../storage/progress-store'
import { TestQuestion } from './TestQuestion'

/**
 * `RF-04`: pregunta sobre el esqueleto completo. Sin `BoneNavigator` ni
 * `BoneIdentity` — ninguna vía con nombre visible, a diferencia de
 * `ExploreView`. El clic en la escena no hace nada: la respuesta se escribe,
 * no se señala.
 */
export function SkeletonTestView() {
  return (
    <TestQuestion
      bones={catalog}
      store={progressStore}
      renderScene={(boneId) => (
        <SkeletonScene
          bones={catalog}
          selected={boneId}
          onPick={() => {}}
          accessibleHint="Un hueso está señalado en el esqueleto. Escribí su nombre en el campo de respuesta."
        />
      )}
    />
  )
}
