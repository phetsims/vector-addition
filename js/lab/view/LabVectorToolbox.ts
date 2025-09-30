// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabVectorToolbox is a specialization of VectorToolbox for the 'Lab' screen.
 *
 * @author Brandon Li
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import VectorToolbox, { VectorToolboxOptions } from '../../common/view/VectorToolbox.js';
import VectorToolboxSlot from '../../common/view/VectorToolboxSlot.js';
import vectorAddition from '../../vectorAddition.js';
import LabScene from '../model/LabScene.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
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

    // Create the initial vector components, the same for all vectors in a set.
    // See https://github.com/phetsims/vector-addition/issues/227
    const initialVectorComponents = ( scene.coordinateSnapMode === 'cartesian' ) ?
                                    new Vector2( 8, 6 ) :
                                    Vector2.createPolar( 8, toRadians( 45 ) );

    // Create a slot for each VectorSet
    const slots: VectorToolboxSlot[] = [];
    [ scene.vectorSet1, scene.vectorSet2 ].forEach( vectorSet => {
      slots.push( new VectorToolboxSlot( scene, vectorSet, sceneNode, initialVectorComponents, {
        symbolProperty: vectorSet.symbolProperty,
        iconArrowMagnitude: 57,
        numberOfVectors: 10, // Each slot can create 10 vectors

        //TODO https://github.com/phetsims/vector-addition/issues/258 This will break the PhET-iO API if symbolProperty is localized.
        tandem: options.tandem.createTandem( `${vectorSet.symbolProperty.value}Slot` )
      } ) );
    } );

    super( slots, options );
  }
}

vectorAddition.register( 'LabVectorToolbox', LabVectorToolbox );