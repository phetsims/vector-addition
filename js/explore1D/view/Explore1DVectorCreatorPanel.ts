// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore1DVectorCreatorPanel is a specialization of VectorCreatorPanel (the vector 'toolbox') for the 'Explore 1D' screen.
 *
 * @author Brandon Li
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import VectorCreatorPanel, { VectorCreatorPanelOptions } from '../../common/view/VectorCreatorPanel.js';
import VectorCreatorPanelSlot from '../../common/view/VectorCreatorPanelSlot.js';
import vectorAddition from '../../vectorAddition.js';
import Explore1DScene from '../model/Explore1DScene.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptySelfOptions;

type Explore1DVectorCreatorPanelOptions = SelfOptions & StrictOmit<VectorCreatorPanelOptions, 'slotSpacing'>;

export default class Explore1DVectorCreatorPanel extends VectorCreatorPanel {

  /**
   * @param scene
   * @param sceneNode
   * @param symbolProperties - the symbols corresponding to each slot
   * @param providedOptions
   */
  public constructor( scene: Explore1DScene,
                      sceneNode: VectorAdditionSceneNode,
                      symbolProperties: TReadOnlyProperty<string>[],
                      providedOptions: Explore1DVectorCreatorPanelOptions ) {

    const options = optionize<Explore1DVectorCreatorPanelOptions, SelfOptions, VectorCreatorPanelOptions>()( {

      // VectorCreatorPanelOptions
      slotSpacing: ( scene.graph.orientation === 'vertical' ) ? 18 : 32
    }, providedOptions );

    // Create the initial vector components, they are the same for every symbol.
    // See https://github.com/phetsims/vector-addition/issues/227
    const isHorizontal = ( scene.graph.orientation === 'horizontal' );
    const initialVectorComponents = isHorizontal ? new Vector2( 5, 0 ) : new Vector2( 0, 5 );

    // Create a slot for each symbol
    const panelSlots: VectorCreatorPanelSlot[] = [];
    symbolProperties.forEach( symbolProperty => {
      panelSlots.push( new VectorCreatorPanelSlot( scene, scene.vectorSet, sceneNode, initialVectorComponents, {
        symbolProperty: symbolProperty,
        iconArrowMagnitude: 35,

        // pointer area dilation for icons, identical for mouseArea and touchArea,
        // see https://github.com/phetsims/vector-addition/issues/250
        iconPointerAreaXDilation: isHorizontal ? 10 : 20,
        iconPointerAreaYDilation: isHorizontal ? 15 : 5,

        //TODO https://github.com/phetsims/vector-addition/issues/258 This will break the PhET-iO API if symbolProperty is localized.
        tandem: options.tandem.createTandem( `${symbolProperty.value}Slot` )
      } ) );
    } );

    super( panelSlots, options );
  }
}

vectorAddition.register( 'Explore1DVectorCreatorPanel', Explore1DVectorCreatorPanel );