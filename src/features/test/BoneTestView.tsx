import { IsolatedBoneScene } from '../../components/IsolatedBoneScene'
import { catalog } from '../../data/catalog'
import { progressStore } from '../../storage/progress-store'
import { TestQuestion } from './TestQuestion'

/**
 * `RF-05`: pregunta sobre un hueso aislado, sin contexto posicional. Mismo
 * `TestQuestion` que `SkeletonTestView` (e4.2) — la única diferencia es qué
 * escena reutiliza, `IsolatedBoneScene` (e3.1) en vez de `SkeletonScene`.
 */
export function BoneTestView() {
  return (
    <TestQuestion
      bones={catalog}
      store={progressStore}
      renderScene={(boneId) => (
        <IsolatedBoneScene
          bones={catalog}
          boneId={boneId}
          accessibleLabel="Un hueso está señalado, aislado del resto del esqueleto. Escribí su nombre en el campo de respuesta."
        />
      )}
    />
  )
}
