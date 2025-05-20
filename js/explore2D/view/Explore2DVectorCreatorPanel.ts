// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore2DVectorCreatorPanel is a specialization of VectorCreatorPanel (the vector 'toolbox') for the 'Explore 2D' screen.
 *
 * @author Brandon Li
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import VectorCreatorPanel, { VectorCreatorPanelOptions } from '../../common/view/VectorCreatorPanel.js';
import VectorCreatorPanelSlot from '../../common/view/VectorCreatorPanelSlot.js';
import vectorAddition from '../../vectorAddition.js';
import Explore2DScene from '../model/Explore2DScene.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';

// initial values for vectors in Cartesian scene, see https://github.com/phetsims/vector-addition/issues/227
const CARTESIAN_INITIAL_VECTOR_COMPONENTS = [
  new Vector2( 6, 8 ), // a
  new Vector2( 8, 6 ), // b
  new Vector2( 0, -10 ) // c
];

// initial values for vectors in Polar scene, see https://github.com/phetsims/vector-addition/issues/227
const POLAR_INITIAL_VECTOR_COMPONENTS = [
  Vector2.createPolar( 8, toRadians( 30 ) ), // d
  Vector2.createPolar( 8, toRadians( 60 ) ), // e
  Vector2.createPolar( 8, toRadians( -90 ) ) // f
];

type SelfOptions = EmptySelfOptions;

type Explore2DVectorCreatorPanelOptions = SelfOptions & VectorCreatorPanelOptions;

export default class Explore2DVectorCreatorPanel extends VectorCreatorPanel {

  /**
   * @param scene
   * @param sceneNode
   * @param symbolProperties - the symbols corresponding to each slot
   * @param providedOptions
   */
  public constructor( scene: Explore2DScene,
                      sceneNode: VectorAdditionSceneNode,
                      symbolProperties: TReadOnlyProperty<string>[],
                      providedOptions: Explore2DVectorCreatorPanelOptions ) {

    const options = providedOptions;

    // Get the initial vector components, they are different for each symbol.
    // See https://github.com/phetsims/vector-addition/issues/227
    const initialVectorComponents = ( scene.coordinateSnapMode === 'cartesian' ) ?
                                    CARTESIAN_INITIAL_VECTOR_COMPONENTS :
                                    POLAR_INITIAL_VECTOR_COMPONENTS;
    assert && assert( initialVectorComponents.length === symbolProperties.length, 'components are required for each symbol' );

    // Create a slot for each symbol
    const panelSlots: VectorCreatorPanelSlot[] = [];
    for ( let i = 0; i < symbolProperties.length; i++ ) {
      panelSlots.push( new VectorCreatorPanelSlot( scene, scene.vectorSet, sceneNode, initialVectorComponents[ i ], {
        symbolProperty: symbolProperties[ i ],
        iconArrowMagnitude: 35,

        // all icons in the slots look the same, see https://github.com/phetsims/vector-addition/issues/227
        iconVectorComponents: new Vector2( 1, 1 )
      } ) );
    }

    super( panelSlots, options );
  }
}

vectorAddition.register( 'Explore2DVectorCreatorPanel', Explore2DVectorCreatorPanel );