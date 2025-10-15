// Copyright 2019-2025, University of Colorado Boulder

/**
 * ExploreVectorToolbox is a specialization of VectorToolbox for the 'Explore 1D' and 'Explore 2D' screens.
 *
 * @author Brandon Li
 */

import optionize from '../../../../phet-core/js/optionize.js';
import VectorAdditionSceneNode from './VectorAdditionSceneNode.js';
import VectorToolbox, { VectorToolboxOptions } from './VectorToolbox.js';
import LabVectorToolboxSlot from '../../lab/view/LabVectorToolboxSlot.js';
import vectorAddition from '../../vectorAddition.js';
import ExploreVectorToolboxSlot from './ExploreVectorToolboxSlot.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ExploreScene from '../model/ExploreScene.js';

type SelfOptions = {
  iconVectorComponents?: Vector2 | null;
};

type Explore1DVectorToolboxOptions = SelfOptions & VectorToolboxOptions;

export default class ExploreVectorToolbox extends VectorToolbox {

  public constructor( scene: ExploreScene,
                      sceneNode: VectorAdditionSceneNode,
                      providedOptions: Explore1DVectorToolboxOptions ) {

    const options = optionize<Explore1DVectorToolboxOptions, SelfOptions, VectorToolboxOptions>()( {

      // SelfOptions
      iconVectorComponents: null
    }, providedOptions );

    // Create a slot for each vector.
    const panelSlots: LabVectorToolboxSlot[] = [];
    scene.allVectors.forEach( vector => {
      panelSlots.push( new ExploreVectorToolboxSlot( vector, scene.vectorSet, scene.graph.modelViewTransformProperty,
        scene.graph.orientation, sceneNode, options.iconVectorComponents, options.tandem.createTandem( `${vector.tandemNameSymbol}Slot` ) ) );
    } );

    super( panelSlots, options );
  }
}

vectorAddition.register( 'ExploreVectorToolbox', ExploreVectorToolbox );