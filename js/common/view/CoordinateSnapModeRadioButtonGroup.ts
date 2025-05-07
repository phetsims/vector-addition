// Copyright 2019-2025, University of Colorado Boulder

/**
 * CoordinateSnapModeRadioButtonGroup is the radio button group for switching between scenes.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import Node, { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;

type CoordinateSnapModeRadioButtonGroupOptions = SelfOptions & NodeTranslationOptions & PickRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

export default class CoordinateSnapModeRadioButtonGroup<T extends VectorAdditionScene> extends RectangularRadioButtonGroup<T> {

  public constructor( sceneProperty: Property<T>,
                      scenes: T[],
                      sceneIcons: Node[],
                      providedOptions: CoordinateSnapModeRadioButtonGroupOptions ) {

    assert && assert( scenes.length === sceneIcons.length );

    const options = optionize4<CoordinateSnapModeRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()(
      {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {
        isDisposable: false
      }, providedOptions );

    const items: RectangularRadioButtonGroupItem<T>[] = [];
    for ( let i = 0; i < scenes.length; i++ ) {
      items.push( {
        value: scenes[ i ],
        createNode: () => sceneIcons[ i ],
        tandemName: `${scenes[ i ].tandem.name}RadioButton`
      } );
    }

    super( sceneProperty, items, options );
  }
}

vectorAddition.register( 'CoordinateSnapModeRadioButtonGroup', CoordinateSnapModeRadioButtonGroup );