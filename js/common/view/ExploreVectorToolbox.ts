// Copyright 2019-2025, University of Colorado Boulder

/**
 * ExploreVectorToolbox is a specialization of VectorToolbox for the 'Explore 1D' and 'Explore 2D' screens.
 * This toolbox supports 1 vector set, and each slot contains 1 vector instance from that vector set.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import vectorAddition from '../../vectorAddition.js';
import ExploreVectorSet from '../model/ExploreVectorSet.js';
import { GraphOrientation } from '../model/GraphOrientation.js';
import ExploreVectorToolboxSlot from './ExploreVectorToolboxSlot.js';
import VectorAdditionSceneNode from './VectorAdditionSceneNode.js';
import VectorToolbox, { VectorToolboxOptions } from './VectorToolbox.js';

type SelfOptions = {
  iconModelComponents: Vector2; // xy-components of the vector icon, in model coordinates
};

type Explore1DVectorToolboxOptions = SelfOptions & VectorToolboxOptions;

export default class ExploreVectorToolbox extends VectorToolbox {

  public constructor( sceneNode: VectorAdditionSceneNode,
                      vectorSet: ExploreVectorSet,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      graphBoundsProperty: TReadOnlyProperty<Bounds2>,
                      graphOrientation: GraphOrientation,
                      providedOptions: Explore1DVectorToolboxOptions ) {

    const options = providedOptions;

    // Create a slot for each vector in the vector set.
    const panelSlots = vectorSet.allVectors.map( vector => new ExploreVectorToolboxSlot( sceneNode, vector, vectorSet,
      modelViewTransformProperty, graphBoundsProperty, options.iconModelComponents,
      graphOrientation, options.tandem.createTandem( `${vector.tandemNameSymbol}Slot` ) ) );

    super( panelSlots, options );
  }
}

vectorAddition.register( 'ExploreVectorToolbox', ExploreVectorToolbox );