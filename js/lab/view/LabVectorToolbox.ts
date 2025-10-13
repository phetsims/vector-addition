// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabVectorToolbox is a specialization of VectorToolbox for the 'Lab' screen.
 *
 * @author Brandon Li
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import VectorToolbox, { VectorToolboxOptions } from '../../common/view/VectorToolbox.js';
import LabVectorToolboxSlot from './LabVectorToolboxSlot.js';
import vectorAddition from '../../vectorAddition.js';
import LabScene from '../model/LabScene.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';

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
      new LabVectorToolboxSlot( scene, scene.vectorSet1, sceneNode, {
        symbolProperty: scene.vectorSet1.symbolProperty,
        numberOfVectors: VectorAdditionConstants.LAB_VECTORS_PER_VECTOR_SET,
        tandem: options.tandem.createTandem( `${scene.vectorSet1.tandemNameSymbol}Slot` )
      } ),

      // vector set 2
      new LabVectorToolboxSlot( scene, scene.vectorSet2, sceneNode, {
        symbolProperty: scene.vectorSet2.symbolProperty,
        numberOfVectors: VectorAdditionConstants.LAB_VECTORS_PER_VECTOR_SET,
        tandem: options.tandem.createTandem( `${scene.vectorSet2.tandemNameSymbol}Slot` )
      } )
    ];

    super( slots, options );
  }
}

vectorAddition.register( 'LabVectorToolbox', LabVectorToolbox );