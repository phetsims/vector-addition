// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorQuantityDisplay is a subclass of NumberDisplay for displaying a quantity that is associated with a Vector.
 * Instances appear in the 'Vector Values' accordion box.
 *
 * Displays a single vector quantity (i.e. magnitude etc.) of a single selected vector that is on the specified graph.
 *
 * 'Is a' relationship with NumberDisplay but adds:
 *  - Functionality to change the selected vector without having to recreate the number display;
 *    NumberDisplays don't support the ability to change the NumberProperty of the panel.
 *    Recreating new NumberDisplays every time the selected vector changes is costly. This creates the number Property
 *    once and derives its value from the attribute of the selected vector.
 *
 * This number display exists for the entire sim and is never disposed.
 *
 * @author Brandon Li
 */

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionScene from '../model/VectorAdditionScene.js';
import Vector from '../model/Vector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import { VectorQuantity } from './VectorQuantity.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import VectorAdditionPreferences from '../model/VectorAdditionPreferences.js';
import { AngleConvention } from '../model/AngleConvention.js';

export default class VectorQuantityDisplay extends NumberDisplay {

  private readonly vectorQuantity: VectorQuantity;

  /**
   * @param scene - the scene that contains the vectors to display
   * @param vectorQuantity - the vector quantity to display
   */
  public constructor( scene: VectorAdditionScene, vectorQuantity: VectorQuantity ) {

    const options: NumberDisplayOptions = {
      isDisposable: false
    };

    //----------------------------------------------------------------------------------------
    // Calculate the range
    //----------------------------------------------------------------------------------------

    // Convenience variables. These are constant for the entire sim.
    const graphBounds = scene.graph.bounds;
    const maxMagnitude = graphBounds.rightTop.distance( graphBounds.leftBottom );
    const graphWidth = graphBounds.width;
    const graphHeight = graphBounds.height;

    let numberDisplayRange: Range;

    if ( vectorQuantity === 'angle' ) {
      numberDisplayRange = VectorAdditionConstants.UNSIGNED_ANGLE_RANGE;
    }
    else if ( vectorQuantity === 'magnitude' ) {
      numberDisplayRange = new Range( 0, maxMagnitude );
    }
    else if ( vectorQuantity === 'xComponent' ) {
      numberDisplayRange = new Range( -graphWidth, graphWidth );
    }
    else { // vectorQuantity === 'yComponent'
      numberDisplayRange = new Range( -graphHeight, graphHeight );
    }

    //----------------------------------------------------------------------------------------
    // Create the number display
    //----------------------------------------------------------------------------------------

    // the value displayed by NumberDisplay, null if there is no selected vector
    const numberDisplayProperty = new Property<number | null>( null, {
      isValidValue: value => ( typeof value === 'number' || value === null )
    } );

    // Round to the specified number of decimal places, and add a degree symbol for angle.
    // No need to localize this string. The degree symbol is universally recognized, especially in STEM contexts.
    options.numberFormatter = ( value: number ) => {
      const valueString = toFixed( value, VectorAdditionConstants.VECTOR_VALUE_DECIMAL_PLACES );
      return ( vectorQuantity === 'angle' ) ? `${valueString}${MathSymbols.DEGREES}` : valueString;
    };

    super( numberDisplayProperty, numberDisplayRange, options );

    this.vectorQuantity = vectorQuantity;

    //----------------------------------------------------------------------------------------
    // Create links
    //----------------------------------------------------------------------------------------

    // Create function to update the number display value
    const selectedVectorComponentsListener = () => {
      numberDisplayProperty.value = this.getNumberDisplayValue( scene.selectedVectorProperty.value,
        VectorAdditionPreferences.instance.angleConventionProperty.value );
    };

    // Observe when the scene's selected vector changes and update the vectorComponents link.
    scene.selectedVectorProperty.link( ( selectedVector, oldSelectedVector ) => {

      // unlink the previous link if the old selected vector exists
      oldSelectedVector && oldSelectedVector.vectorComponentsProperty.unlink( selectedVectorComponentsListener );

      // Observe when the selected vector changes and update the number display value if and only if the
      // selected vector exists. unlink is required when selected vector changes.
      selectedVector && selectedVector.vectorComponentsProperty.link( selectedVectorComponentsListener );
    } );

    VectorAdditionPreferences.instance.angleConventionProperty.link( () => selectedVectorComponentsListener() );
  }

  /**
   * Gets the value to display based on the attribute display type and a vector
   */
  private getNumberDisplayValue( selectedVector: Vector | null, angleConvention: AngleConvention ): number | null {

    if ( !selectedVector ) {
      return null;
    }

    if ( this.vectorQuantity === 'magnitude' ) {
      return selectedVector.magnitude;
    }
    else if ( this.vectorQuantity === 'angle' ) {
      return selectedVector.getAngleDegrees( angleConvention );
    }
    else if ( this.vectorQuantity === 'xComponent' ) {
      return selectedVector.xComponent;
    }
    else if ( this.vectorQuantity === 'yComponent' ) {
      return selectedVector.yComponent;
    }
    throw new Error( 'invalid case for getNumberDisplayValue' );
  }
}

vectorAddition.register( 'VectorQuantityDisplay', VectorQuantityDisplay );