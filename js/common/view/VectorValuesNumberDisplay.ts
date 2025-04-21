// Copyright 2019-2023, University of Colorado Boulder

/**
 * VectorValuesNumberDisplay is a subclass of NumberDisplay for displaying a value that is associated with a Vector.
 * Instances appear in the 'Vector Values' toggle box.
 *
 * Displays a single vector attribute (i.e. magnitude etc.) of a single active vector that is on the specified graph.
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
import Graph from '../model/Graph.js';
import Vector from '../model/Vector.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import VectorQuantity from './VectorQuantity.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';

export default class VectorValuesNumberDisplay extends NumberDisplay {

  private readonly vectorQuantity: VectorQuantity;

  /**
   * @param graph - the graph that contains the vectors to display
   * @param vectorQuantity - the vector quantity to display
   */
  public constructor( graph: Graph, vectorQuantity: VectorQuantity ) {

    const options: NumberDisplayOptions = {
      isDisposable: false
    };

    //----------------------------------------------------------------------------------------
    // Calculate the range
    //----------------------------------------------------------------------------------------

    // Convenience variables. These are constant for the entire sim.
    const maxMagnitude = graph.graphModelBounds.rightTop.distance( graph.graphModelBounds.leftBottom );
    const graphWidth = graph.graphModelBounds.width;
    const graphHeight = graph.graphModelBounds.height;

    let numberDisplayRange: Range;

    if ( vectorQuantity === VectorQuantity.ANGLE ) {
      numberDisplayRange = VectorAdditionConstants.ANGLE_RANGE;
    }
    else if ( vectorQuantity === VectorQuantity.MAGNITUDE ) {
      numberDisplayRange = new Range( 0, maxMagnitude );
    }
    else if ( vectorQuantity === VectorQuantity.X_COMPONENT ) {
      numberDisplayRange = new Range( -graphWidth, graphWidth );
    }
    else { // vectorQuantity === VectorQuantity.Y_COMPONENT
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
      return ( vectorQuantity === VectorQuantity.ANGLE ) ? `${valueString}${MathSymbols.DEGREES}` : valueString;
    };

    super( numberDisplayProperty, numberDisplayRange, options );

    this.vectorQuantity = vectorQuantity;

    //----------------------------------------------------------------------------------------
    // Create links
    //----------------------------------------------------------------------------------------

    // Create function to update the number display value
    const activeVectorComponentsListener = () => {
      numberDisplayProperty.value = this.getNumberDisplayValue( graph.activeVectorProperty.value );
    };

    // Observe when the graph's active vector changes and update the vectorComponents link.
    // unlink is unnecessary, exists for the lifetime of the sim.
    graph.activeVectorProperty.link( ( activeVector, oldActiveVector ) => {

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

    if ( this.vectorQuantity === VectorQuantity.MAGNITUDE ) {
      return activeVector.magnitude;
    }
    else if ( this.vectorQuantity === VectorQuantity.ANGLE ) {
      return activeVector.angleDegrees;
    }
    else if ( this.vectorQuantity === VectorQuantity.X_COMPONENT ) {
      return activeVector.xComponent;
    }
    else if ( this.vectorQuantity === VectorQuantity.Y_COMPONENT ) {
      return activeVector.yComponent;
    }
    throw new Error( 'invalid case for getNumberDisplayValue' );
  }
}

vectorAddition.register( 'VectorValuesNumberDisplay', VectorValuesNumberDisplay );