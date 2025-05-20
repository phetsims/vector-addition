// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorQuantityDisplay is a subclass of NumberDisplay for displaying a quantity that is associated with a Vector.
 * Instances appear in the 'Vector Values' accordion box.
 *
 * Displays a single vector quantity (i.e. magnitude etc.) of a single active vector that is on the specified graph.
 *
 * 'Is a' relationship with NumberDisplay but adds:
 *  - Functionality to change the active vector without having to recreate the number display;
 *    NumberDisplays don't support the ability to change the NumberProperty of the panel.
 *    Recreating new NumberDisplays every time the active vector changes is costly. This creates the number Property
 *    once and derives its value from the attribute of the active vector.
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
      numberDisplayRange = VectorAdditionConstants.ANGLE_RANGE;
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

    // the value displayed by NumberDisplay, null if there is no active vector
    const numberDisplayProperty = new Property<number | null>( null, {
      isValidValue: value => ( typeof value === 'number' || value === null )
    } );

    // Round to the specified number of decimal places, and add a degree symbol for angle.
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
    const activeVectorComponentsListener = () => {
      numberDisplayProperty.value = this.getNumberDisplayValue( scene.activeVectorProperty.value );
    };

    // Observe when the scene's active vector changes and update the vectorComponents link.
    // unlink is unnecessary, exists for the lifetime of the sim.
    scene.activeVectorProperty.link( ( activeVector, oldActiveVector ) => {

      // unlink the previous link if the old active vector exists
      oldActiveVector && oldActiveVector.vectorComponentsProperty.unlink( activeVectorComponentsListener );

      // Observe when the active vector changes and update the number display value if and only if the active vector
      // exists. unlink is required when active vector changes.
      activeVector && activeVector.vectorComponentsProperty.link( activeVectorComponentsListener );
    } );
  }

  /**
   * Gets the value to display based on the attribute display type and a vector
   */
  private getNumberDisplayValue( activeVector: Vector | null ): number | null {

    if ( !activeVector ) {
      return null;
    }

    if ( this.vectorQuantity === 'magnitude' ) {
      return activeVector.magnitude;
    }
    else if ( this.vectorQuantity === 'angle' ) {
      return activeVector.getAngleDegrees();
    }
    else if ( this.vectorQuantity === 'xComponent' ) {
      return activeVector.xComponent;
    }
    else if ( this.vectorQuantity === 'yComponent' ) {
      return activeVector.yComponent;
    }
    throw new Error( 'invalid case for getNumberDisplayValue' );
  }
}

vectorAddition.register( 'VectorQuantityDisplay', VectorQuantityDisplay );