// Copyright 2019-2023, University of Colorado Boulder

/**
 * EquationsVector is a specialization of Vector for the 'Equations' screen.  It adds mutable coefficient and base vector.
 * Instances exist for the lifetime of the sim and do not need to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import CartesianBaseVector from '../../common/model/CartesianBaseVector.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import PolarBaseVector from '../../common/model/PolarBaseVector.js';
import Vector from '../../common/model/Vector.js';
import vectorAddition from '../../vectorAddition.js';
import { LabelDisplayData } from '../../common/model/RootVector.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import EquationsGraph from './EquationsGraph.js';
import EquationsVectorSet from './EquationsVectorSet.js';
import BaseVector from '../../common/model/BaseVector.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

// constants

// initial coefficient and range
const DEFAULT_COEFFICIENT = 1;
const COEFFICIENT_RANGE = new Range( -5, 5 );

// super class options
const OPTIONS = {
  isRemovable: false,       // Equations vectors are not removable
  isTipDraggable: false,    // Equations vectors are not draggable by the tip
  isOnGraphInitially: true  // Equations vectors are always on the graph
};

export default class EquationsVector extends Vector {

  public readonly coefficientProperty: NumberProperty;
  public readonly baseVector: BaseVector;

  /**
   * @param initialTailPosition - starting tail position of the vector
   * @param initialComponents - starting components of the vector
   * @param baseVectorTailPosition - starting tail position of the base vector
   * @param graph - the graph the vector belongs to
   * @param vectorSet - the VectorSet that the vector belongs to
   * @param symbol - the symbol for the vector (i.e. 'a', 'b', 'c', ...)
   */
  public constructor( initialTailPosition: Vector2,
                      initialComponents: Vector2,
                      baseVectorTailPosition: Vector2,
                      graph: EquationsGraph,
                      vectorSet: EquationsVectorSet,
                      symbol: string ) {


    super( initialTailPosition, initialComponents, graph, vectorSet, symbol, OPTIONS );

    this.coefficientProperty = new NumberProperty( DEFAULT_COEFFICIENT, {
      range: COEFFICIENT_RANGE
    } );

    // Set the tip to itself to ensure Invariants for Polar/Cartesian is satisfied.
    this.setTipWithInvariants( this.tip );

    // Instantiate a base vector based on snap mode.
    if ( graph.coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {
      this.baseVector = new CartesianBaseVector( baseVectorTailPosition,
        this.vectorComponents.dividedScalar( DEFAULT_COEFFICIENT ), graph, vectorSet, symbol );
    }
    else {
      this.baseVector = new PolarBaseVector( baseVectorTailPosition,
        this.vectorComponents.dividedScalar( DEFAULT_COEFFICIENT ), graph, vectorSet, symbol );
    }

    // Observe when the base vector changes, or when the coefficient Property changes and update the vector.
    // unmultilink is unnecessary, exists for the lifetime of the sim.
    Multilink.multilink( [ this.baseVector.vectorComponentsProperty, this.coefficientProperty ],
      ( baseVector, coefficient ) => {
        this.vectorComponents = baseVector.timesScalar( coefficient );
      } );
  }

  public override reset(): void {
    super.reset();
    this.coefficientProperty.reset();
    this.baseVector.reset();
  }

  /**
   * See RootVector.getLabelDisplayData for details.
   */
  public override getLabelDisplayData( valuesVisible: boolean ): LabelDisplayData {
    return combineOptions<LabelDisplayData>( super.getLabelDisplayData( valuesVisible ), {
      coefficient: this.coefficientProperty.value
    } );
  }
}

vectorAddition.register( 'EquationsVector', EquationsVector );