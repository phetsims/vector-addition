// Copyright 2025, University of Colorado Boulder

/**
 * HorizontalVerticalSceneRadioButtonGroup is a radio button group for switching between horizontal and vertical 1D scenes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import vectorAddition from '../../vectorAddition.js';
import Property from '../../../../axon/js/Property.js';
import VectorAdditionIconFactory from './VectorAdditionIconFactory.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

type CartesianPolarRadioButtonGroupOptions = SelfOptions & NodeTranslationOptions &
  PickRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

export default class HorizontalVerticalSceneRadioButtonGroup<T extends VectorAdditionScene> extends RectangularRadioButtonGroup<T> {

  public constructor( sceneProperty: Property<T>,
                      horizontalScene: T,
                      verticalScene: T,
                      providedOptions: CartesianPolarRadioButtonGroupOptions ) {

    const options = optionize4<CartesianPolarRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()(
      {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {

        // RectangularRadioButtonGroupOptions
        isDisposable: false,
        phetioVisiblePropertyInstrumented: true,
        accessibleName: VectorAdditionStrings.a11y.horizontalVerticalSceneRadioButtonGroup.accessibleNameStringProperty,
        accessibleHelpText: VectorAdditionStrings.a11y.horizontalVerticalSceneRadioButtonGroup.accessibleHelpTextStringProperty
      }, providedOptions );

    const items: RectangularRadioButtonGroupItem<T>[] = [
      {
        value: horizontalScene,
        createNode: () => VectorAdditionIconFactory.createGraphOrientationIcon( 'horizontal' ),
        tandemName: 'horizontalRadioButton',
        options: {
          accessibleName: VectorAdditionStrings.a11y.horizontalRadioButton.accessibleNameStringProperty
        }
      },
      {
        value: verticalScene,
        createNode: () => VectorAdditionIconFactory.createGraphOrientationIcon( 'vertical' ),
        tandemName: 'verticalRadioButton',
        options: {
          accessibleName: VectorAdditionStrings.a11y.verticalRadioButton.accessibleNameStringProperty
        }
      }
    ];

    super( sceneProperty, items, options );
  }
}

vectorAddition.register( 'HorizontalVerticalSceneRadioButtonGroup', HorizontalVerticalSceneRadioButtonGroup );