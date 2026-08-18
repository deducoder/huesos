import { IsolatedBoneScene } from '../../components/IsolatedBoneScene'
import { catalog } from '../../data/catalog'
import { progressStore } from '../../storage/progress-store'
import { TestQuestion } from './TestQuestion'

/**
 * `RF-05`: pregunta sobre un hueso aislado, sin contexto posicional. Mismo
 * `TestQuestion` que `SkeletonTestView` (e4.2) — la única diferencia es qué
 * escena reutiliza, `IsolatedBoneScene` (e3.1) en vez de `SkeletonScene`.
 */
export function BoneTestView({ onCambiarModo }: { onCambiarModo?: () => void }) {
  return (
    <TestQuestion
      bones={catalog}
      store={progressStore}
      onCambiarModo={onCambiarModo}
      renderScene={(boneId) => (
        <IsolatedBoneScene
          bones={catalog}
          boneId={boneId}
          accessibleLabel="Un hueso está señalado, aislado del resto del esqueleto. Elegí su nombre entre las 3 opciones."
        />
      )}
    />
  )
}
