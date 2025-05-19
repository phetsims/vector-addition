// Copyright 2025, University of Colorado Boulder

/**
 * CartesianPolarSceneRadioButtonGroup is a radio button group for switching between Cartesian and polar scenes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import vectorAddition from '../../vectorAddition.js';
import Property from '../../../../axon/js/Property.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import VectorColorPalette from '../model/VectorColorPalette.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

type CartesianPolarRadioButtonGroupOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

export default class CartesianPolarSceneRadioButtonGroup<T extends VectorAdditionScene> extends RectangularRadioButtonGroup<T> {

  public constructor( sceneProperty: Property<T>,
                      cartesianScene: T,
                      cartesianColorPalette: VectorColorPalette,
                      polarScene: T,
                      polarColorPalette: VectorColorPalette,
                      providedOptions: CartesianPolarRadioButtonGroupOptions ) {

    const options = optionize4<CartesianPolarRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()(
      {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {

        // RectangularRadioButtonGroupOptions
        isDisposable: false,
        accessibleName: VectorAdditionStrings.a11y.cartesianPolarRadioButtonGroup.accessibleNameStringProperty,
        accessibleHelpText: VectorAdditionStrings.a11y.cartesianPolarRadioButtonGroup.accessibleHelpTextStringProperty
      }, providedOptions );

    const items: RectangularRadioButtonGroupItem<T>[] = [
      {
        value: cartesianScene,
        createNode: () => VectorAdditionIconFactory.createCartesianSceneIcon( cartesianColorPalette ),
        tandemName: 'cartesianRadioButton',
        options: {
          accessibleName: VectorAdditionStrings.a11y.cartesianSceneRadioButton.accessibleNameStringProperty,
          accessibleHelpText: VectorAdditionStrings.a11y.cartesianSceneRadioButton.accessibleHelpTextStringProperty
        }
      },
      {
        value: polarScene,
        createNode: () => VectorAdditionIconFactory.createPolarSceneIcon( polarColorPalette ),
        tandemName: 'polarRadioButton',
        options: {
          accessibleName: VectorAdditionStrings.a11y.polarSceneRadioButton.accessibleNameStringProperty,
          accessibleHelpText: VectorAdditionStrings.a11y.polarSceneRadioButton.accessibleHelpTextStringProperty
        }
      }
    ];

    super( sceneProperty, items, options );
  }
}

vectorAddition.register( 'CartesianPolarSceneRadioButtonGroup', CartesianPolarSceneRadioButtonGroup );