// Copyright 2019-2025, University of Colorado Boulder

/**
 * ExploreVectorToolbox is a specialization of VectorToolbox for the 'Explore 1D' and 'Explore 2D' screens.
 * This toolbox supports 1 vectors set, and each slot contains 1 vector instance from that vector set.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import vectorAddition from '../../vectorAddition.js';
import ExploreScene from '../model/ExploreScene.js';
import ExploreVectorToolboxSlot from './ExploreVectorToolboxSlot.js';
import VectorAdditionSceneNode from './VectorAdditionSceneNode.js';
import VectorToolbox, { VectorToolboxOptions } from './VectorToolbox.js';

type SelfOptions = {
  iconModelComponents: Vector2;
};

type Explore1DVectorToolboxOptions = SelfOptions & VectorToolboxOptions;

export default class ExploreVectorToolbox extends VectorToolbox {

  public constructor( scene: ExploreScene,
                      sceneNode: VectorAdditionSceneNode,
                      providedOptions: Explore1DVectorToolboxOptions ) {

    const options = providedOptions;

    // Create a slot for each vector in the vector set.
    const panelSlots = scene.vectorSet.allVectors.map( vector => new ExploreVectorToolboxSlot( vector, scene.vectorSet,
      scene.graph.modelViewTransformProperty, scene.graph.boundsProperty, sceneNode, options.iconModelComponents,
      scene.graph.orientation, options.tandem.createTandem( `${vector.tandemNameSymbol}Slot` ) ) );

    super( panelSlots, options );
  }
}

vectorAddition.register( 'ExploreVectorToolbox', ExploreVectorToolbox );