// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabVectorToolbox is a specialization of VectorToolbox for the 'Lab' screen.
 * This toolbox manages 2 vector sets, and supports dragging multiple vectors out of the toolbox for each vector set.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import VectorToolbox, { VectorToolboxOptions } from '../../common/view/VectorToolbox.js';
import vectorAddition from '../../vectorAddition.js';
import LabVectorToolboxSlot from './LabVectorToolboxSlot.js';
import LabVectorSet from '../model/LabVectorSet.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

type SelfOptions = EmptySelfOptions;

type LabVectorToolboxOptions = SelfOptions & StrictOmit<VectorToolboxOptions, 'ySpacing'>;

export default class LabVectorToolbox extends VectorToolbox {

  public constructor( sceneNode: VectorAdditionSceneNode,
                      vectorSet1: LabVectorSet,
                      vectorSet2: LabVectorSet,
                      modelViewTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      graphBoundsProperty: TReadOnlyProperty<Bounds2>,
                      providedOptions: LabVectorToolboxOptions ) {

    const options = optionize<LabVectorToolboxOptions, SelfOptions, VectorToolboxOptions>()( {

      // VectorToolboxOptions
      ySpacing: 40
    }, providedOptions );

    // Create a slot for each VectorSet
    const slots = [

      // vector set 1
      new LabVectorToolboxSlot( sceneNode, vectorSet1, modelViewTransformProperty, graphBoundsProperty,
        options.tandem.createTandem( `${vectorSet1.tandemNameSymbol}Slot` ) ),

      // vector set 2
      new LabVectorToolboxSlot( sceneNode, vectorSet2, modelViewTransformProperty, graphBoundsProperty,
        options.tandem.createTandem( `${vectorSet2.tandemNameSymbol}Slot` ) )
    ];

    super( slots, options );
  }
}

vectorAddition.register( 'LabVectorToolbox', LabVectorToolbox );