// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabVectorToolbox is a specialization of VectorToolbox for the 'Lab' screen.
 * This toolbox manages 2 vector sets, and supports dragging multiple vectors out of the toolbox for each vector set.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import VectorToolbox, { VectorToolboxOptions } from '../../common/view/VectorToolbox.js';
import LabVectorToolboxSlot from './LabVectorToolboxSlot.js';
import vectorAddition from '../../vectorAddition.js';
import LabScene from '../model/LabScene.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptySelfOptions;

type LabVectorToolboxOptions = SelfOptions & StrictOmit<VectorToolboxOptions, 'ySpacing'>;

export default class LabVectorToolbox extends VectorToolbox {

  public constructor( scene: LabScene,
                      sceneNode: VectorAdditionSceneNode,
                      providedOptions: LabVectorToolboxOptions ) {

    const options = optionize<LabVectorToolboxOptions, SelfOptions, VectorToolboxOptions>()( {

      // VectorToolboxOptions
      ySpacing: 40
    }, providedOptions );

    // Create a slot for each VectorSet
    const slots = [

      // vector set 1
      new LabVectorToolboxSlot( scene.vectorSet1, scene.graph.modelViewTransformProperty, sceneNode,
        options.tandem.createTandem( `${scene.vectorSet1.tandemNameSymbol}Slot` ) ),

      // vector set 2
      new LabVectorToolboxSlot( scene.vectorSet2, scene.graph.modelViewTransformProperty, sceneNode,
        options.tandem.createTandem( `${scene.vectorSet2.tandemNameSymbol}Slot` ) )
    ];

    super( slots, options );
  }
}

vectorAddition.register( 'LabVectorToolbox', LabVectorToolbox );