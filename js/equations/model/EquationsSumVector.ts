// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsSumVector is a specialization of SumVector for the 'Equations' screen.  It computes the 'sum' differently
 * depending on the equation type.  Instances exist for the lifetime of the sim and do not need to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SumVector from '../../common/model/SumVector.js';
import Vector from '../../common/model/Vector.js';
import vectorAddition from '../../vectorAddition.js';
import { EquationType } from './EquationType.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorSet from '../../common/model/VectorSet.js';
import EquationsScene from './EquationsScene.js';

export default class EquationsSumVector extends SumVector {

  private readonly equationTypeProperty: TReadOnlyProperty<EquationType>;

  /**
   * @param initialTailPosition - starting tail position of the vector
   * @param scene - scene the sum vector belongs to
   * @param vectorSet - the vector set that the sum vector represents
   * @param symbolProperty - the symbol for the vector (i.e. 'a', 'b', 'c', ...)
   * @param tandemNameSymbol - symbol for the vector used in tandem names
   * @param tandem
   */
  public constructor( initialTailPosition: Vector2,
                      scene: EquationsScene,
                      vectorSet: VectorSet,
                      symbolProperty: TReadOnlyProperty<string>,
                      tandemNameSymbol: string,
                      tandem: Tandem ) {

    super( initialTailPosition, scene, vectorSet, symbolProperty, tandemNameSymbol, tandem );

    this.equationTypeProperty = scene.equationTypeProperty;

    // Observe when each vector changes and/or when the equationType changes to calculate the sum.
    const xyComponentsProperties = vectorSet.vectors.map( vector => vector.xyComponentsProperty );
    Multilink.multilinkAny( [ scene.equationTypeProperty, ...xyComponentsProperties ],
      () => this.updateSum( vectorSet.vectors )
    );
  }

  /**
   * Calculate the sum vector for the Equations screen.
   */
  protected override updateSum( vectors: ObservableArray<Vector> ): void {

    const equationType = this.equationTypeProperty.value;

    // Denoted by 'a' + 'b' = 'c'
    if ( equationType === 'addition' ) {
      const sum = new Vector2( 0, 0 );

      vectors.forEach( vector => {
        sum.add( vector.xyComponents );
      } );

      this.xyComponentsProperty.value = sum;
    }
    else if ( equationType === 'subtraction' ) {
      const calculatedComponents = vectors.get( 0 ).xyComponents.copy();

      // Subtract from the first vector
      _.drop( vectors ).forEach( vector => {
        calculatedComponents.subtract( vector.xyComponents );
      } );

      this.xyComponentsProperty.value = calculatedComponents;
    }
    else if ( equationType === 'negation' ) {

      // Same as addition but negated: a + b = -c or a + b + c = 0
      const sum = new Vector2( 0, 0 );

      vectors.forEach( vector => {
        sum.add( vector.xyComponents );
      } );

      this.xyComponentsProperty.value = sum.negate();
    }
  }
}

vectorAddition.register( 'EquationsSumVector', EquationsSumVector );